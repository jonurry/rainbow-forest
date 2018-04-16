class Queue {
  constructor() {
    this.queue = [];
  }
  add(fn) {
    this.queue.push(fn);
  }
  executeNext() {
    // execute the next function in the queue
    if (this.queue.length > 0) {
      this.queue.shift()();
    }
  }
  get length() {
    return this.queue.length;
  }
}

export default Queue;
