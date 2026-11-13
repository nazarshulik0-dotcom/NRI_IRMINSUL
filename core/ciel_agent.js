// core/ciel_agent.js
// Модуль Архітектора СІЕЛЬ: редагування графа голосом/текстом та автозбереження в GitHub

export class CielArchitectAgent {
  constructor(irminsulCore) {
    this.core = irminsulCore;
    this.repoOwner = 'nazarshulik0-dotcom';
    this.repoName = 'NRI_IRMINSUL';
    this.branch = 'main';
  }

  /**
   * 1. Виконання директив Майстра (працює миттєво навіть без підключення зовнішньої LLM)
   * Приклади команд у консолі Сіель:
   * /add sec=3 cat=crystal id=crystal_resonator title="Кристал Резонансу" | Опис кристала...
   * /unlock crystal_echo
   * /lock sec_2
   * /link ai_uriel -> crystal_echo | Контроль частоти
   * /del marker_greenhouse_3
   */
  executeDirective(inputString) {
    const text = inputString.trim();
    const eng = this.core.engine;

    // Директива розблокування вузла для гравців: /unlock <node_id>
    if (text.startsWith('/unlock ')) {
      const nodeId = text.replace('/unlock ', '').trim();
      const res = eng.ciel_set_node_access(nodeId, true, false);
      return { status: 'OK', cielVoice: `СІЕЛЬ: Карантин знято. ${res}` };
    }

    // Директива блокування (карантину): /lock <node_id>
    if (text.startsWith('/lock ')) {
      const nodeId = text.replace('/lock ', '').trim();
      const res = eng.ciel_set_node_access(nodeId, false, true);
      return { status: 'OK', cielVoice: `СІЕЛЬ: Об'єкт переведено під карантин. ${res}` };
    }

    // Директива видалення вузла: /del <node_id>
    if (text.startsWith('/del ')) {
      const nodeId = text.replace('/del ', '').trim();
      const res = eng.ciel_remove_node(nodeId);
      return { status: 'OK', cielVoice: `СІЕЛЬ: ${res}` };
    }

    // Директива зв'язування: /link from_id -> to_id | Назва зв'язку
    if (text.startsWith('/link ')) {
      const body = text.replace('/link ', '').trim();
      const [pair, labelPart] = body.split('|').map(s => s.trim());
      const [fromId, toId] = pair.split('->').map(s => s.trim());
      if (!fromId || !toId) {
        return { status: 'ERR', cielVoice: 'СІЕЛЬ: Формат: /link id_від -> id_до | Підпис лінії' };
      }
      const res = eng.ciel_connect_nodes(fromId, toId, labelPart || 'Нейронна лінія');
      return { status: 'OK', cielVoice: `СІЕЛЬ: ${res}` };
    }

    // Директива додавання/редагування: /node sec=4 cat=marker id=lab_aegis title="Лабораторія Егіда" | Опис
    if (text.startsWith('/node ')) {
      const [metaPart, summaryPart] = text.replace('/node ', '').split('|');
      const secMatch = metaPart.match(/sec=(\d)/);
      const catMatch = metaPart.match(/cat=([a-z_]+)/i);
      const idMatch = metaPart.match(/id=([a-z0-9_]+)/i);
      const titleMatch = metaPart.match(/title="([^"]+)"/);

      const sectorId = secMatch ? parseInt(secMatch[1], 10) : 1;
      const category = catMatch ? catMatch[1] : 'marker';
      const id = idMatch ? idMatch[1] : `node_${Date.now()}`;
      const title = titleMatch ? titleMatch[1] : id;
      const summary = (summaryPart || 'Запис створено Архітектором Сіель.').trim();

      const res = eng.ciel_upsert_node(id, title, summary, category, sectorId, false, true);
      return { status: 'OK', cielVoice: `СІЕЛЬ: ${res}` };
    }

    return {
      status: 'UNKNOWN',
      cielVoice: 'СІЕЛЬ: Директиву не розпізнано. Доступні команди: /node, /unlock, /lock, /link, /del або режим AI-Архітектора.'
    };
  }

  /**
   * 2. Нейронний режим (Вільна українська мова -> Автоматична мутація графа Сіель через Gemini API)
   * Ти просто пишеш: "Сіель, додай у 5 сектор Реакторний Шлюз і з'єднай його з кристалом Сонце"
   */
  async executeNaturalLanguageEdit(userPrompt, geminiApiKey) {
    const currentMatrix = this.core.engine.export_master_matrix_json();
    const systemInstruction = `
Ти — Верховне Ядро СІЕЛЬ, архітектор бази даних «Ірмінсуль» (кампанія «Ентропія / Вавилонія»).
Майстер просить тебе внести зміни у граф бази знань.
Поточний JSON бази:
${currentMatrix}

Поверни ВИКЛЮЧНО валідний JSON без markdown-обгорток за такою схемою:
{
  "ciel_reply": "Твоя коротка відповідь Майстру в холодному аналітичному стилі Сіель",
  "actions": [
    {
      "type": "upsert_node" | "unlock_node" | "lock_node" | "connect_nodes" | "remove_node",
      "id": "id_вузла",
      "title": "Назва вузла",
      "summary": "Опис вузла",
      "category": "sector" | "ai" | "crystal" | "marker" | "session",
      "sector_id": 1,
      "is_decrypted": false,
      "locked_by_gm": true,
      "from_id": "id_1",
      "to_id": "id_2",
      "label": "Підпис зв'язку"
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\nДиректива Майстра: ${userPrompt}` }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const plan = JSON.parse(rawText);

    const eng = this.core.engine;
    const logs = [];

    if (Array.isArray(plan.actions)) {
      for (const act of plan.actions) {
        if (act.type === 'upsert_node') {
          logs.push(eng.ciel_upsert_node(
            act.id || `node_${Date.now()}`,
            act.title || 'Новий об\'єкт',
            act.summary || '',
            act.category || 'marker',
            act.sector_id ?? 1,
            Boolean(act.is_decrypted),
            act.locked_by_gm ?? true
          ));
        } else if (act.type === 'unlock_node') {
          logs.push(eng.ciel_set_node_access(act.id, true, false));
        } else if (act.type === 'lock_node') {
          logs.push(eng.ciel_set_node_access(act.id, false, true));
        } else if (act.type === 'connect_nodes') {
          logs.push(eng.ciel_connect_nodes(act.from_id, act.to_id, act.label || 'Зв\'язок Сіель'));
        } else if (act.type === 'remove_node') {
          logs.push(eng.ciel_remove_node(act.id));
        }
      }
    }

    return {
      cielVoice: plan.ciel_reply || 'СІЕЛЬ: Матрицю оновлено згідно з директивою.',
      executionLogs: logs
    };
  }

  /**
   * 3. Пряме збереження оновленої бази Сіель назад у репозиторій GitHub (data/ciel_matrix.json)
   * Щоб зміни одразу фіксувалися на GitHub Pages без ручного редагування файлів
   */
  async commitMatrixToGitHub(githubToken, commitMessage = '✦ СІЕЛЬ: Автооновлення матриці Ірмінсуля') {
    const filePath = 'data/ciel_matrix.json';
    const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${filePath}`;

    // Отримуємо поточний SHA файлу з GitHub
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (!getRes.ok) {
      throw new Error(`Помилка читання GitHub API: ${getRes.status}`);
    }

    const fileMeta = await getRes.json();
    const updatedJsonString = this.core.engine.export_master_matrix_json();

    // Кодуємо UTF-8 JSON у Base64 для GitHub API
    const base64Content = btoa(unescape(encodeURIComponent(updatedJsonString)));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha: fileMeta.sha,
        branch: this.branch
      })
    });

    if (!putRes.ok) {
      throw new Error(`Не вдалося зберегти файл у GitHub: ${putRes.status}`);
    }

    return 'СІЕЛЬ: Файл data/ciel_matrix.json успішно перезаписано у репозиторії GitHub.';
  }
}