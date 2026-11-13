// core/irminsul_core.js
// Центральний логічний контролер Ірмінсуля (WASM + JSON Бази Сіель + RAG + Аудіо-реєстр)

import init, { IrminsulEngine, LayoutMode, UserRole } from '../irminsul_wasm/pkg/irminsul_wasm.js';

export class IrminsulCore {
  constructor() {
    this.engine = null;
    this.matrixData = null;
    this.audioManifest = null;
    this.chronicleData = null;
    this.role = UserRole.Master;
  }

  // 1. Повна ініціалізація: завантаження WASM + усіх баз із папки /data/ напряму в Rust
  async initialize() {
    await init();
    this.engine = new IrminsulEngine();

    const [matrixRes, audioRes, chronicleRes] = await Promise.all([
      fetch('./data/ciel_matrix.json'),
      fetch('./data/audio_manifest.json'),
      fetch('./data/session_chronicle.json')
    ]);

    this.matrixData = await matrixRes.json();
    this.audioManifest = await audioRes.json();
    this.chronicleData = await chronicleRes.json();

    // Завантажуємо всю матрицю Сіель (сектори, Архангелів, кристали) напряму в Rust WASM
    this.engine.load_external_matrix(JSON.stringify(this.matrixData));

    // Синхронізуємо додаткові теми карантину з JSON у Rust-ядро
    if (this.matrixData?.meta?.default_locked_topics) {
      this.matrixData.meta.default_locked_topics.forEach(topic => {
        this.engine.lock_topic(topic);
      });
    }

    // Вплітаємо збережені сесії з session_chronicle.json у граф Rust
    if (this.chronicleData?.sessions) {
      this.chronicleData.sessions.forEach(ses => {
        this.engine.ingest_session_logs(ses.title, JSON.stringify(ses.events));
      });
    }

    return this.getFullState();
  }

  // 2. Перемикання ролі (Master бачить архів Сіель, Player бачить гліфи Вавилонії)
  setRole(isMaster) {
    this.role = isMaster ? UserRole.Master : UserRole.Player;
    return this.getFullState();
  }

  // 3. Розрахунок геометрії через Rust (Tree, Radial, Orbit, Hex)
  computeLayout(modeName = 'Radial', radius = 420.0, hexSize = 175.0) {
    const modeMap = {
      Tree: LayoutMode.Tree,
      Radial: LayoutMode.Radial,
      Orbit: LayoutMode.Orbit,
      Hex: LayoutMode.Hex
    };
    const mode = modeMap[modeName] ?? LayoutMode.Radial;
    this.engine.compute_layout(mode, radius, hexSize);
    return this.getFullState();
  }

  // 4. Отримання стану графа напряму з Rust WASM
  getFullState() {
    return JSON.parse(this.engine.export_view_json(this.role));
  }

  // 5. Генератор RAG-контексту Сіель (формує пакет знань для промпту ШІ без спойлерів)
  buildCielRagPrompt(sectorFilter = null) {
    const state = this.getFullState();
    const accessible = state.nodes.filter(n => {
      const roleAllowed = (this.role === UserRole.Master) || n.is_decrypted;
      const sectorAllowed = (sectorFilter === null) || (n.sector_id === sectorFilter);
      return roleAllowed && sectorAllowed;
    });

    const lines = accessible.map(n => `[Сектор ${n.sector_id} | ${n.category.toUpperCase()}] ${n.title}: ${n.summary}`);
    return [
      `=== АКТИВНИЙ ЗРІЗ ПАМ'ЯТІ ІРМІНСУЛЯ (ЯДРО СІЕЛЬ) ===`,
      `Статус суб-ядра Рафаїля: ${state.raphael_state}`,
      `Доступних вузлів знань: ${accessible.length}`,
      ...lines
    ].join('\n');
  }

  // 6. Перевірка запиту гравця через Fail-Safe у Rust
  verifyQuerySafety(queryText) {
    const verdict = this.engine.check_fail_safe(queryText, this.role);
    const isBlocked = verdict.startsWith('BLOCKED');
    return {
      allowed: !isBlocked,
      message: verdict,
      audioClip: isBlocked ? this.audioManifest?.echolocation_bank?.access_denied_ciel : null
    };
  }

  // 7. Отримання статичного аудіо з банку (щоб не витрачати токени ElevenLabs)
  getSystemAudio(key) {
    return this.audioManifest?.echolocation_bank?.[key] || null;
  }

  // 8. Крипто-сейф API ключів через WASM
  encryptKey(rawKey, masterPassword) {
    return Array.from(this.engine.encrypt_api_key_to_vector(rawKey, masterPassword));
  }

  decryptKey(byteArray, masterPassword) {
    return this.engine.decrypt_api_key(new Uint8Array(byteArray), masterPassword);
  }
}
