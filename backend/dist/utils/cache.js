"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 300000; // 5 minutos
    }
    set(key, data, ttl) {
        const expires = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { data, expires });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    // Limpar itens expirados
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key);
            }
        }
    }
    // Executar cleanup a cada 5 minutos
    startCleanup() {
        setInterval(() => this.cleanup(), 300000);
    }
}
exports.cache = new MemoryCache();
exports.cache.startCleanup();
//# sourceMappingURL=cache.js.map