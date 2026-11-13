/* @ts-self-types="./irminsul_wasm.d.ts" */

export class IrminsulEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IrminsulEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_irminsulengine_free(ptr, 0);
    }
    /**
     * Активація Маяка Архангела (1..=9). Якщо всі 9 зібрані — Рафаїль еволюціонує у Manas
     * @param {number} beacon_num
     * @returns {string}
     */
    activate_archangel_beacon(beacon_num) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.irminsulengine_activate_archangel_beacon(this.__wbg_ptr, beacon_num);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Fail-Safe перевірка тексту запиту гравця на спойлери перед відправкою в LLM
     * @param {string} user_query
     * @param {UserRole} role
     * @returns {string}
     */
    check_fail_safe(user_query, role) {
        let deferred3_0;
        let deferred3_1;
        try {
            const val2 = +role;
            const ptr0 = passStringToWasm0(user_query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.irminsulengine_check_fail_safe(this.__wbg_ptr, ptr0, len0, val2);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @param {string} words_csv
     * @returns {string}
     */
    compile_automaton_script(words_csv) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(words_csv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.irminsulengine_compile_automaton_script(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {LayoutMode} mode
     * @param {number} base_radius
     * @param {number} hex_size
     */
    compute_layout(mode, base_radius, hex_size) {
        wasm.irminsulengine_compute_layout(this.__wbg_ptr, mode, base_radius, hex_size);
    }
    /**
     * Крок 2: Гравці відповідають «Так, розшифруй» — Сіель відкриває вузол і оновлює карту
     * @param {string} node_id
     * @returns {string}
     */
    confirm_echolocation(node_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(node_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.irminsulengine_confirm_echolocation(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Відновлює API-ключ у пам'яті браузера з числового вектора після введення пароля Майстра
     * @param {Uint8Array | number[]} encrypted_vec
     * @param {string} master_password
     * @returns {string}
     */
    static decrypt_api_key_from_vector(encrypted_vec, master_password) {
        let deferred3_0;
        let deferred3_1;
        try {
            let ptr0, len0, ptr1, len1;
            try {
                ptr0 = passArray8ToWasm0(encrypted_vec, wasm.__wbindgen_malloc);
                len0 = WASM_VECTOR_LEN;
                ptr1 = passStringToWasm0(master_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                len1 = WASM_VECTOR_LEN;
            } catch (e) {
                if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
                if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
                throw e;
            }
            const ret = wasm.irminsulengine_decrypt_api_key_from_vector(ptr0, len0, ptr1, len1);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Перетворює відкритий API-ключ на зашифрований числовий вектор під пароль Майстра
     * @param {string} raw_key
     * @param {string} master_password
     * @returns {Uint8Array}
     */
    static encrypt_api_key_to_vector(raw_key, master_password) {
        let ptr0, len0, ptr1, len1;
        try {
            ptr0 = passStringToWasm0(raw_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            len0 = WASM_VECTOR_LEN;
            ptr1 = passStringToWasm0(master_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            len1 = WASM_VECTOR_LEN;
        } catch (e) {
            if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
            if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
            throw e;
        }
        const ret = wasm.irminsulengine_encrypt_api_key_to_vector(ptr0, len0, ptr1, len1);
        var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v3;
    }
    /**
     * Віддає список вузлів та ребер з урахуванням ролі (Гравець бачить гліфи на закритих вузлах, Майстер — усе)
     * @param {UserRole} role
     * @returns {string}
     */
    export_view_json(role) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.irminsulengine_export_view_json(this.__wbg_ptr, role);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Вплітає масив подій із history.js (Листи Персонажів + Карта + Діалоги) у нову гілку Ірмінсуля
     * @param {string} session_id
     * @param {string} title
     * @param {string} logs_json
     * @returns {string}
     */
    ingest_session_logs(session_id, title, logs_json) {
        let deferred4_0;
        let deferred4_1;
        try {
            let ptr0, len0, ptr1, len1, ptr2, len2;
            try {
                ptr0 = passStringToWasm0(session_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                len0 = WASM_VECTOR_LEN;
                ptr1 = passStringToWasm0(title, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                len1 = WASM_VECTOR_LEN;
                ptr2 = passStringToWasm0(logs_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                len2 = WASM_VECTOR_LEN;
            } catch (e) {
                if (ptr2) { wasm.__wbindgen_free(ptr2, len2 * 1, 1); }
                if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
                if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
                throw e;
            }
            const ret = wasm.irminsulengine_ingest_session_logs(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            deferred4_0 = ret[0];
            deferred4_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
     * Додавання вивченого слова мови Вавилонії та компіляція скрипту для автоматонів
     * @param {string} word
     */
    learn_babylon_word(word) {
        const ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.irminsulengine_learn_babylon_word(this.__wbg_ptr, ptr0, len0);
    }
    constructor() {
        const ret = wasm.irminsulengine_new();
        this.__wbg_ptr = ret;
        IrminsulEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Крок 1: Гравці клікають на зашифрований маркер на карті
     * @param {string} node_id
     * @returns {string}
     */
    request_echolocation(node_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(node_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.irminsulengine_request_echolocation(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Ручне блокування/розблокування теми Майстром (аналог команди /lock_topic)
     * @param {string} topic
     * @param {boolean} locked
     */
    set_topic_lock(topic, locked) {
        const val2 = +locked;
        const ptr0 = passStringToWasm0(topic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.irminsulengine_set_topic_lock(this.__wbg_ptr, ptr0, len0, val2);
    }
}
if (Symbol.dispose) IrminsulEngine.prototype[Symbol.dispose] = IrminsulEngine.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const LayoutMode = Object.freeze({
    Tree: 0, "0": "Tree",
    Radial: 1, "1": "Radial",
    Orbit: 2, "2": "Orbit",
    Hex: 3, "3": "Hex",
});

/**
 * @enum {0 | 1 | 2}
 */
export const RaphaelState = Object.freeze({
    Dormant: 0, "0": "Dormant",
    Active: 1, "1": "Active",
    Manas: 2, "2": "Manas",
});

/**
 * @enum {0 | 1}
 */
export const UserRole = Object.freeze({
    Player: 0, "0": "Player",
    Master: 1, "1": "Master",
});
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_4c88d8bf264fd984: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            table.set(0, undefined);
            table.set(1024, undefined);
            table.set(1025, null);
            table.set(1026, true);
            table.set(1027, false);
        },
    };
    return {
        __proto__: null,
        "./irminsul_wasm_bg.js": import0,
    };
}

const IrminsulEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_irminsulengine_free(ptr, 1));

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(bytes) {
    numBytesDecoded += bytes.length;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
        cachedTextDecoder.decode();
        numBytesDecoded = bytes.length;
    }
    return cachedTextDecoder.decode(bytes);
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

let __wbg_init_promise;
async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;
    if (__wbg_init_promise === undefined) {
        __wbg_init_promise = __wbg_init_once(module_or_path);
        __wbg_init_promise.catch(() => { __wbg_init_promise = undefined; });
    }
    return __wbg_init_promise;
}

async function __wbg_init_once(module_or_path) {

    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('irminsul_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
