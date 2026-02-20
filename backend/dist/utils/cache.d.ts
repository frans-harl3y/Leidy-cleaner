declare class MemoryCache {
    private cache;
    private defaultTTL;
    set(key: string, data: any, ttl?: number): void;
    get(key: string): any | null;
    delete(key: string): void;
    clear(): void;
    cleanup(): void;
    startCleanup(): void;
}
export declare const cache: MemoryCache;
export {};
//# sourceMappingURL=cache.d.ts.map