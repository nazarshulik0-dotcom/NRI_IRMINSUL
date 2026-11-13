/* tslint:disable */
/* eslint-disable */

export class IrminsulEngine {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Активація Маяка Архангела (1..=9). Якщо всі 9 зібрані — Рафаїль еволюціонує у Manas
     */
    activate_archangel_beacon(beacon_num: number): string;
    /**
     * Fail-Safe перевірка тексту запиту гравця на спойлери перед відправкою в LLM
     */
    check_fail_safe(user_query: string, role: UserRole): string;
    compile_automaton_script(words_csv: string): string;
    compute_layout(mode: LayoutMode, base_radius: number, hex_size: number): void;
    /**
     * Крок 2: Гравці відповідають «Так, розшифруй» — Сіель відкриває вузол і оновлює карту
     */
    confirm_echolocation(node_id: string): string;
    /**
     * Відновлює API-ключ у пам'яті браузера з числового вектора після введення пароля Майстра
     */
    static decrypt_api_key_from_vector(encrypted_vec: Uint8Array | number[], master_password: string): string;
    /**
     * Перетворює відкритий API-ключ на зашифрований числовий вектор під пароль Майстра
     */
    static encrypt_api_key_to_vector(raw_key: string, master_password: string): Uint8Array;
    /**
     * Віддає список вузлів та ребер з урахуванням ролі (Гравець бачить гліфи на закритих вузлах, Майстер — усе)
     */
    export_view_json(role: UserRole): string;
    /**
     * Вплітає масив подій із history.js (Листи Персонажів + Карта + Діалоги) у нову гілку Ірмінсуля
     */
    ingest_session_logs(session_id: string, title: string, logs_json: string): string;
    /**
     * Додавання вивченого слова мови Вавилонії та компіляція скрипту для автоматонів
     */
    learn_babylon_word(word: string): void;
    constructor();
    /**
     * Крок 1: Гравці клікають на зашифрований маркер на карті
     */
    request_echolocation(node_id: string): string;
    /**
     * Ручне блокування/розблокування теми Майстром (аналог команди /lock_topic)
     */
    set_topic_lock(topic: string, locked: boolean): void;
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
    readonly irminsulengine_compile_automaton_script: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_compute_layout: (a: number, b: number, c: number, d: number) => void;
    readonly irminsulengine_confirm_echolocation: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_decrypt_api_key_from_vector: (a: number, b: number, c: number, d: number) => [number, number];
    readonly irminsulengine_encrypt_api_key_to_vector: (a: number, b: number, c: number, d: number) => [number, number];
    readonly irminsulengine_export_view_json: (a: number, b: number) => [number, number];
    readonly irminsulengine_ingest_session_logs: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly irminsulengine_learn_babylon_word: (a: number, b: number, c: number) => void;
    readonly irminsulengine_new: () => number;
    readonly irminsulengine_request_echolocation: (a: number, b: number, c: number) => [number, number];
    readonly irminsulengine_set_topic_lock: (a: number, b: number, c: number, d: number) => void;
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
