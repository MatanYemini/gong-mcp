/**
 * Token-bucket limiter sized for Gong's 3-requests-per-second cap.
 * `acquire()` resolves once a slot is free; callers must await it before issuing a request.
 */
export class RateLimiter {
  private readonly capacity: number;
  private readonly refillIntervalMs: number;
  private tokens: number;
  private lastRefill: number;
  private queue: Array<() => void> = [];

  constructor(opts: { ratePerSecond: number; burst?: number } = { ratePerSecond: 3 }) {
    this.capacity = opts.burst ?? opts.ratePerSecond;
    this.refillIntervalMs = 1000 / opts.ratePerSecond;
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }
    await new Promise<void>((resolve) => {
      this.queue.push(resolve);
      this.scheduleDrain();
    });
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed <= 0) return;
    const earned = elapsed / this.refillIntervalMs;
    if (earned >= 1) {
      this.tokens = Math.min(this.capacity, this.tokens + earned);
      this.lastRefill = now;
    }
  }

  private scheduleDrain(): void {
    const wait = Math.max(0, this.refillIntervalMs - (Date.now() - this.lastRefill));
    setTimeout(() => this.drain(), wait + 1);
  }

  private drain(): void {
    this.refill();
    while (this.tokens >= 1 && this.queue.length > 0) {
      this.tokens -= 1;
      const next = this.queue.shift();
      if (next) next();
    }
    if (this.queue.length > 0) this.scheduleDrain();
  }
}
