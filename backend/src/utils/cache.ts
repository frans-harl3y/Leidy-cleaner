interface CacheItem {
  data: any;
  expires: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem>();
  private defaultTTL = 300000; // 5 minutos
  private intervalId: NodeJS.Timeout | null = null;

  set(key: string, data: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpar itens expirados
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Executar cleanup a cada 5 minutos
  startCleanup(): void {
    this.intervalId = setInterval(() => this.cleanup(), 300000);
  }

  // Parar cleanup (útil em testes para evitar handles abertos)
  stopCleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId as NodeJS.Timeout);
      this.intervalId = null;
    }
  }
}

export const cache = new MemoryCache();
cache.startCleanup();