export class Pool<T> {
  private free: T[] = [];
  constructor(private factory: () => T, private reset: (x: T) => void) {}
  acquire(): T { return this.free.pop() ?? this.factory(); }
  release(x: T) { this.reset(x); this.free.push(x); }
  size() { return { free: this.free.length }; }
}
