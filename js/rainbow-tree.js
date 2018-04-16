const createTreeCanvas = height => {
  let canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = Math.floor(height * 1.3);
  return canvas;
};

const flipHorizontally = (context, around) => {
  context.translate(0, around);
  context.scale(-1, 1);
  context.translate(0, -around);
};

const flipVertically = (context, around) => {
  context.translate(0, around);
  context.scale(1, -1);
  context.translate(0, -around);
};

class RainbowTree {
  constructor(height = 0) {
    this.height = height;
    this.width = height * 1.3;
    this.canvas = createTreeCanvas(this.height);
    this.cx = this.canvas.getContext('2d');
    this.cx.translate(this.width / 2, 0);
    flipHorizontally(this.cx, this.width / 2);
    flipVertically(this.cx, this.height / 2);
  }
  drawToQueue(queue, length, angle, scale) {
    queue.add(() => {
      this.cx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)})`;
    });
    queue.add(() => {
      this.cx.fillRect(-length / 20, 0, length / 10, length);
    });
    if (length < 8) return;
    queue.add(() => {
      this.cx.save();
    });
    queue.add(() => {
      this.cx.translate(0, length);
    });
    queue.add(() => {
      this.cx.rotate(-angle + (Math.random() - 0.5) / 3);
    });
    this.drawToQueue(
      queue,
      length * scale,
      angle + Math.random() * 0.2 - 0.1,
      scale
    );
    queue.add(() => {
      this.cx.rotate(2 * angle + (Math.random() - 0.5) / 3);
    });
    this.drawToQueue(
      queue,
      length * scale,
      angle + Math.random() * 0.2 - 0.1,
      scale
    );
    queue.add(() => {
      this.cx.restore();
    });
  }
}

export default RainbowTree;
