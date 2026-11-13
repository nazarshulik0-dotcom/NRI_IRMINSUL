use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum LayoutMode {
    Tree,
    Radial,
    Orbit,
    Hex,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum UserRole {
    Player,
    Master,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum RaphaelState {
    Dormant,
    Active,
    Manas,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct IrminsulNode {
    pub id: String,
    pub title: String,
    pub summary: String,
    pub category: String,
    pub sector_id: u8,
    #[serde(default = "default_coord")]
    pub x: f64,
    #[serde(default = "default_coord")]
    pub y: f64,
    pub is_decrypted: bool,
    pub locked_by_gm: bool,
}

fn default_coord() -> f64 {
    3000.0
}

#[derive(Clone, Serialize, Deserialize)]
pub struct IrminsulEdge {
    pub from: String,
    pub to: String,
    pub label: String,
}

#[derive(Serialize, Deserialize)]
struct ExternalMatrixFile {
    #[serde(default)]
    nodes: Vec<IrminsulNode>,
    #[serde(default)]
    edges: Vec<IrminsulEdge>,
}

#[derive(Serialize)]
struct ExportView {
    raphael_state: String,
    active_beacons: u8,
    nodes: Vec<IrminsulNode>,
    edges: Vec<IrminsulEdge>,
    locked_topics: Vec<String>,
}

#[derive(Deserialize)]
struct SessionEventInput {
    actor: String,
    action: String,
    sector: u8,
}

#[wasm_bindgen]
pub struct IrminsulEngine {
    nodes: Vec<IrminsulNode>,
    edges: Vec<IrminsulEdge>,
    raphael_state: RaphaelState,
    active_beacons: u8,
    locked_topics: Vec<String>,
}

#[wasm_bindgen]
impl IrminsulEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> IrminsulEngine {
        let mut engine = IrminsulEngine {
            nodes: Vec::new(),
            edges: Vec::new(),
            raphael_state: RaphaelState::Dormant,
            active_beacons: 0,
            locked_topics: vec![
                "сектор 0".to_string(),
                "сіель".to_string(),
                "ciel".to_string(),
                "істинна причина катастрофи".to_string(),
                "еволюція в манаса".to_string(),
                "коди архангелів".to_string(),
                "кубяка".to_string(),
            ],
        };
        engine.init_default_seed();
        engine.compute_layout(LayoutMode::Radial, 420.0, 175.0);
        engine
    }

    fn init_default_seed(&mut self) {
        self.nodes.push(IrminsulNode {
            id: "sec_0".into(),
            title: "Сектор 0: Цитадель СІЕЛЬ".into(),
            summary: "Центральне ядро управління Вавилонією. Мости підняті.".into(),
            category: "core".into(),
            sector_id: 0,
            x: 3000.0,
            y: 3000.0,
            is_decrypted: false,
            locked_by_gm: true,
        });
    }

    /// 1. ЗАВАНТАЖЕННЯ ПОВНОЇ БАЗИ З data/ciel_matrix.json У RUST
    pub fn load_external_matrix(&mut self, raw_json: &str) -> String {
        match serde_json::from_str::<ExternalMatrixFile>(raw_json) {
            Ok(parsed) => {
                if !parsed.nodes.is_empty() {
                    self.nodes = parsed.nodes;
                    self.edges = parsed.edges;
                    self.compute_layout(LayoutMode::Radial, 420.0, 175.0);
                }
                format!("OK: Завантажено {} вузлів та {} зв'язків у ядро Сіель.", self.nodes.len(), self.edges.len())
            }
            Err(e) => format!("ERROR: Не вдалося прочитати ciel_matrix.json: {}", e),
        }
    }

    /// 2. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Додати або оновити вузол наживо
    pub fn ciel_upsert_node(
        &mut self,
        id: &str,
        title: &str,
        summary: &str,
        category: &str,
        sector_id: u8,
        is_decrypted: bool,
        locked_by_gm: bool,
    ) -> String {
        if let Some(existing) = self.nodes.iter_mut().find(|n| n.id == id) {
            existing.title = title.to_string();
            existing.summary = summary.to_string();
            existing.category = category.to_string();
            existing.sector_id = sector_id;
            existing.is_decrypted = is_decrypted;
            existing.locked_by_gm = locked_by_gm;
            format!("UPDATED: Вузол «{}» оновлено ядром Сіель.", id)
        } else {
            self.nodes.push(IrminsulNode {
                id: id.to_string(),
                title: title.to_string(),
                summary: summary.to_string(),
                category: category.to_string(),
                sector_id,
                x: 3000.0,
                y: 3000.0,
                is_decrypted,
                locked_by_gm,
            });
            // Автоматично прив'язуємо новий вузол до його сектору, якщо це не сам сектор
            let parent_sec = format!("sec_{}", sector_id);
            if id != parent_sec && self.nodes.iter().any(|n| n.id == parent_sec) {
                self.edges.push(IrminsulEdge {
                    from: parent_sec,
                    to: id.to_string(),
                    label: "Гілка Сіель".to_string(),
                });
            }
            self.compute_layout(LayoutMode::Radial, 420.0, 175.0);
            format!("CREATED: Новий вузол «{}» вплетено у Сектор {}.", id, sector_id)
        }
    }

    /// 3. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Створити нейронний зв'язок між двома вузлами
    pub fn ciel_connect_nodes(&mut self, from_id: &str, to_id: &str, label: &str) -> String {
        let exists = self.edges.iter().any(|e| e.from == from_id && e.to == to_id);
        if !exists {
            self.edges.push(IrminsulEdge {
                from: from_id.to_string(),
                to: to_id.to_string(),
                label: label.to_string(),
            });
            format!("LINKED: {} -> {} ({})", from_id, to_id, label)
        } else {
            "EXISTS: Такий зв'язок уже існує.".to_string()
        }
    }

    /// 4. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Змінити статус карантину / дешифровки вузла
    pub fn ciel_set_node_access(&mut self, node_id: &str, is_decrypted: bool, locked_by_gm: bool) -> String {
        if let Some(node) = self.nodes.iter_mut().find(|n| n.id == node_id) {
            node.is_decrypted = is_decrypted;
            node.locked_by_gm = locked_by_gm;
            format!(
                "ACCESS_UPDATED: Вузол «{}» -> розшифровано={}, карантин={}",
                node.title, is_decrypted, locked_by_gm
            )
        } else {
            format!("NOT_FOUND: Вузол «{}» не знайдено.", node_id)
        }
    }

    /// 5. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Видалити вузол із матриці
    pub fn ciel_remove_node(&mut self, node_id: &str) -> String {
        if node_id == "sec_0" {
            return "DENIED: Неможливо видалити центральне ядро Сіель (sec_0).".to_string();
        }
        let before = self.nodes.len();
        self.nodes.retain(|n| n.id != node_id);
        self.edges.retain(|e| e.from != node_id && e.to != node_id);
        if self.nodes.len() < before {
            format!("REMOVED: Вузол «{}» та його гілки вилучено з Ірмінсуля.", node_id)
        } else {
            format!("NOT_FOUND: Вузол «{}» не знайдено.", node_id)
        }
    }

    /// 6. Експорт чистої матриці для автоматичного збереження у data/ciel_matrix.json
    pub fn export_master_matrix_json(&self) -> String {
        let data = serde_json::json!({
            "meta": {
                "system": "IRMINSUL_CIEL_CORE",
                "version": "1.1.0",
                "center_coords": { "x": 3000, "y": 3000 },
                "default_locked_topics": self.locked_topics
            },
            "nodes": self.nodes,
            "edges": self.edges
        });
        serde_json::to_string_pretty(&data).unwrap_or_else(|_| "{}".to_string())
    }

    /// Математичний розрахунок 4 режимів геометрії (Tree, Radial, Orbit, Hex)
    pub fn compute_layout(&mut self, mode: LayoutMode, base_radius: f64, hex_size: f64) {
        let cx = 3000.0;
        let cy = 3000.0;

        match mode {
            LayoutMode::Tree => {
                let mut sec_counts = [0usize; 9];
                for node in self.nodes.iter_mut() {
                    if node.id == "sec_0" {
                        node.x = cx;
                        node.y = cy - 480.0;
                    } else if node.category == "sector" {
                        let s = (node.sector_id as f64) - 4.5;
                        node.x = cx + s * 260.0;
                        node.y = cy - 120.0;
                    } else {
                        let s_idx = (node.sector_id as usize).min(8);
                        sec_counts[s_idx] += 1;
                        let s = (node.sector_id as f64) - 4.5;
                        node.x = cx + s * 260.0 + ((sec_counts[s_idx] % 2) as f64 - 0.5) * 70.0;
                        node.y = cy + 120.0 + (sec_counts[s_idx] as f64) * 145.0;
                    }
                }
            }
            LayoutMode::Radial | LayoutMode::Orbit => {
                let mut sub_index = [0usize; 9];
                for node in self.nodes.iter_mut() {
                    if node.id == "sec_0" {
                        node.x = cx;
                        node.y = cy;
                    } else if node.category == "sector" {
                        let angle = ((node.sector_id as f64 - 1.0) / 8.0) * std::f64::consts::PI * 2.0
                            - std::f64::consts::FRAC_PI_2;
                        node.x = cx + base_radius * angle.cos();
                        node.y = cy + base_radius * angle.sin();
                    } else {
                        let s_idx = (node.sector_id as usize).min(8);
                        let local_i = sub_index[s_idx];
                        sub_index[s_idx] += 1;

                        let base_angle = ((node.sector_id as f64 - 1.0) / 8.0) * std::f64::consts::PI * 2.0
                            - std::f64::consts::FRAC_PI_2;
                        let spread = (local_i as f64 - 0.8) * 0.22;
                        let r = if mode == LayoutMode::Orbit {
                            base_radius + 230.0 + (local_i as f64) * 55.0
                        } else {
                            base_radius + 250.0
                        };
                        node.x = cx + r * (base_angle + spread).cos();
                        node.y = cy + r * (base_angle + spread).sin();
                    }
                }
            }
            LayoutMode::Hex => {
                let hex_coords: [(i32, i32); 9] = [
                    (0, 0),
                    (1, -1), (1, 0), (0, 1), (-1, 1),
                    (-1, 0), (0, -1), (2, -1), (-2, 1),
                ];
                let mut child_offset = [0usize; 9];
                for node in self.nodes.iter_mut() {
                    let s_idx = (node.sector_id as usize).min(8);
                    let (q, r) = hex_coords[s_idx];
                    let sec_x = cx + hex_size * (3.0_f64.sqrt() * (q as f64) + (3.0_f64.sqrt() / 2.0) * (r as f64));
                    let sec_y = cy + hex_size * (1.5 * (r as f64));

                    if node.id == "sec_0" || node.category == "sector" {
                        node.x = sec_x;
                        node.y = sec_y;
                    } else {
                        let idx = child_offset[s_idx];
                        child_offset[s_idx] += 1;
                        let angle = (idx as f64) * 1.6;
                        node.x = sec_x + 115.0 * angle.cos();
                        node.y = sec_y + 115.0 * angle.sin();
                    }
                }
            }
        }
    }

    pub fn export_view_json(&self, role: UserRole) -> String {
        let is_manas = self.raphael_state == RaphaelState::Manas;
        let visible_nodes: Vec<IrminsulNode> = self
            .nodes
            .iter()
            .map(|n| {
                let mut copy = n.clone();
                let unlocked = role == UserRole::Master || is_manas || (n.is_decrypted && !n.locked_by_gm);
                if !unlocked {
                    copy.title = format!("░▒▓ ŦĦΞ ◈ S{}-404", n.sector_id);
                    copy.summary = "[СИГНАТУРУ ЗАШИФРОВАНО КАРАНТИНОМ СІЕЛЬ]".to_string();
                }
                copy
            })
            .collect();

        let state_str = match self.raphael_state {
            RaphaelState::Dormant => "Dormant",
            RaphaelState::Active => "Active",
            RaphaelState::Manas => "Manas",
        };

        let view = ExportView {
            raphael_state: state_str.to_string(),
            active_beacons: self.active_beacons,
            nodes: visible_nodes,
            edges: self.edges.clone(),
            locked_topics: self.locked_topics.clone(),
        };

        serde_json::to_string(&view).unwrap_or_else(|_| "{}".to_string())
    }

    pub fn activate_archangel_beacon(&mut self, sector_id: u8) -> String {
        if sector_id >= 1 && sector_id <= 9 {
            self.active_beacons = self.active_beacons.max(sector_id);
        }
        if self.active_beacons >= 9 {
            self.raphael_state = RaphaelState::Manas;
            for n in self.nodes.iter_mut() {
                n.is_decrypted = true;
                n.locked_by_gm = false;
            }
            "СИНХРОНІЗАЦІЮ 9/9 ЗАВЕРШЕНО. Суб-ядро Рафаїль інтегровано з ядром Сіель у статус МАНАСА.".to_string()
        } else {
            self.raphael_state = RaphaelState::Active;
            format!("Маяк Архангела #{} активовано. Статус Рафаїля: ACTIVE.", sector_id)
        }
    }

    pub fn request_echolocation(&self, node_id: &str) -> String {
        if self.raphael_state == RaphaelState::Dormant {
            return serde_json::json!({
                "status": "LOCKED_DORMANT",
                "raphael_voice": "Система навігації перебуває у сплячому режимі. Активуйте маяк Сектора I.",
                "display_summary": "[ДОСТУП ЗАБЛОКОВАНО: РАФАЇЛЬ DORMANT]"
            }).to_string();
        }
        if let Some(node) = self.nodes.iter().find(|n| n.id == node_id) {
            if node.locked_by_gm && self.raphael_state != RaphaelState::Manas {
                return serde_json::json!({
                    "status": "QUARANTINE_CIEL",
                    "raphael_voice": "Відмовлено. Цей об'єкт перебуває під прямим карантином ядра Сіель.",
                    "display_summary": "[КАРАНТИН СІЕЛЬ: ПОТРІБЕН ДОПУСК МАЙСТРА]"
                }).to_string();
            }
            serde_json::json!({
                "status": "AWAITING_CONFIRM",
                "raphael_voice": "Виявлено зашифрований сигнатурний маркер. Бажаєте розшифрувати даний об'єкт?",
                "display_summary": "Сигнатура готова до резонансної дешифровки. Очікую підтвердження."
            }).to_string()
        } else {
            serde_json::json!({
                "status": "ERROR",
                "raphael_voice": "Об'єкт не знайдено в матриці Ірмінсуля.",
                "display_summary": "Помилка індексу."
            }).to_string()
        }
    }

    pub fn confirm_echolocation(&mut self, node_id: &str) -> String {
        if let Some(node) = self.nodes.iter_mut().find(|n| n.id == node_id) {
            node.is_decrypted = true;
            serde_json::json!({
                "status": "DECRYPTED",
                "raphael_voice": format!("Дешифровку завершено. Об'єкт «{}» синхронізовано з картою.", node.title),
                "title": node.title,
                "summary": node.summary
            }).to_string()
        } else {
            "{}".to_string()
        }
    }

    pub fn lock_topic(&mut self, topic: &str) {
        let clean = topic.trim().to_lowercase();
        if !clean.is_empty() && !self.locked_topics.contains(&clean) {
            self.locked_topics.push(clean);
        }
    }

    pub fn check_fail_safe(&self, query: &str, role: UserRole) -> String {
        if role == UserRole::Master || self.raphael_state == RaphaelState::Manas {
            return "ALLOWED: Повний рівень допуску (Майстер / Манас).".to_string();
        }
        let q_lower = query.to_lowercase();
        for taboo in &self.locked_topics {
            if q_lower.contains(taboo) {
                return format!("BLOCKED: Протокол Сіель заблокував запит (виявлено карантинний маркер «{}»).", taboo);
            }
        }
        "ALLOWED: Запит безпечний для поточного контуру гравців.".to_string()
    }

    pub fn ingest_session_logs(&mut self, session_title: &str, events_json: &str) -> String {
        let events: Vec<SessionEventInput> = serde_json::from_str(events_json).unwrap_or_default();
        let node_id = format!("ses_{}", self.nodes.len());
        let target_sector = events.first().map(|e| e.sector).unwrap_or(1);

        let mut summary_lines = Vec::new();
        for ev in &events {
            summary_lines.push(format!("• [{}] {}", ev.actor, ev.action));
        }

        self.nodes.push(IrminsulNode {
            id: node_id.clone(),
            title: session_title.to_string(),
            summary: summary_lines.join("\n"),
            category: "session".to_string(),
            sector_id: target_sector,
            x: 3000.0,
            y: 3000.0,
            is_decrypted: true,
            locked_by_gm: false,
        });

        self.edges.push(IrminsulEdge {
            from: format!("sec_{}", target_sector),
            to: node_id.clone(),
            label: "Хроніка сесії".to_string(),
        });

        self.compute_layout(LayoutMode::Radial, 420.0, 175.0);
        node_id
    }

    pub fn encrypt_api_key_to_vector(&self, raw_key: &str, master_pass: &str) -> Vec<u8> {
        let pass_bytes = master_pass.as_bytes();
        if pass_bytes.is_empty() {
            return Vec::new();
        }
        raw_key
            .as_bytes()
            .iter()
            .enumerate()
            .map(|(i, &b)| b ^ pass_bytes[i % pass_bytes.len()] ^ ((i as u8).wrapping_mul(31)))
            .collect()
    }

    pub fn decrypt_api_key(&self, encrypted: &[u8], master_pass: &str) -> String {
        let pass_bytes = master_pass.as_bytes();
        if pass_bytes.is_empty() {
            return String::new();
        }
        let raw: Vec<u8> = encrypted
            .iter()
            .enumerate()
            .map(|(i, &b)| b ^ pass_bytes[i % pass_bytes.len()] ^ ((i as u8).wrapping_mul(31)))
            .collect();
        String::from_utf8(raw).unwrap_or_else(|_| "INVALID_PASSWORD".to_string())
    }
}