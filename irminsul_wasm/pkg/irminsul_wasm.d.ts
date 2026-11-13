/* tslint:disable */
/* eslint-disable */

export class IrminsulEngine {
    free(): void;
    [Symbol.dispose](): void;
    activate_archangel_beacon(sector_id: number): string;
    check_fail_safe(query: string, role: UserRole): string;
    /**
     * 3. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Створити нейронний зв'язок між двома вузлами
     */
    ciel_connect_nodes(from_id: string, to_id: string, label: string): string;
    /**
     * 5. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Видалити вузол із матриці
     */
    ciel_remove_node(node_id: string): string;
    /**
     * 4. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Змінити статус карантину / дешифровки вузла
     */
    ciel_set_node_access(node_id: string, is_decrypted: boolean, locked_by_gm: boolean): string;
    /**
     * 2. ФУНКЦІЯ АРХІТЕКТОРА СІЕЛЬ: Додати або оновити вузол наживо
     */
    ciel_upsert_node(id: string, title: string, summary: string, category: string, sector_id: number, is_decrypted: boolean, locked_by_gm: boolean): string;
    /**
     * Математичний розрахунок 4 режимів геометрії (Tree, Radial, Orbit, Hex)
     */
    compute_layout(mode: LayoutMode, base_radius: number, hex_size: number): void;
    confirm_echolocation(node_id: string): string;
    decrypt_api_key(encrypted: Uint8Array | number[], master_pass: string): string;
    encrypt_api_key_to_vector(raw_key: string, master_pass: string): Uint8Array;
    /**
     * 6. Експорт чистої матриці для автоматичного збереження у data/ciel_matrix.json
     */
    export_master_matrix_json(): string;
    export_view_json(role: UserRole): string;
    ingest_session_logs(session_title: string, events_json: string): string;
    /**
     * 1. ЗАВАНТАЖЕННЯ ПОВНОЇ БАЗИ З data/ciel_matrix.json У RUST
     */
    load_external_matrix(raw_json: string): string;
    lock_topic(topic: string): void;
    constructor();
    request_echolocation(node_id: string): string;
}

export enum LayoutMode {
    Tree = 0,
    Radial = 1,
    Orbit = 2,
    Hex = 3,
}

export enum RaphaelState {
    Dormant = 0,
    Active = 1,
    Manas = 2,
}

export enum UserRole {
    Player = 0,
    Master = 1,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_irminsulengine_free: (a: number, b: number) => void;
    readonly irminsulengine_activate_archangel_beacon: (a: number, b: number) => [number, number];
    readonly irminsulengine_check_fail_safe: (a: number, b: number, c: number, d: number) => [number, number];
    readonly irminsulengine_ciel_connect_nodes: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly irminsulengine_ciel_remove_node: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_ciel_set_node_access: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly irminsulengine_ciel_upsert_node: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => [number, number];
    readonly irminsulengine_compute_layout: (a: number, b: number, c: number, d: number) => void;
    readonly irminsulengine_confirm_echolocation: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_decrypt_api_key: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly irminsulengine_encrypt_api_key_to_vector: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly irminsulengine_export_master_matrix_json: (a: number) => [number, number];
    readonly irminsulengine_export_view_json: (a: number, b: number) => [number, number];
    readonly irminsulengine_ingest_session_logs: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly irminsulengine_load_external_matrix: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_lock_topic: (a: number, b: number, c: number) => void;
    readonly irminsulengine_new: () => number;
    readonly irminsulengine_request_echolocation: (a: number, b: number, c: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
