const createCanvas = () => {
  let canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 116;
  canvas.style.zIndex = 99;
  return canvas;
};

const createImage = () => {
  let img = document.createElement('img');
  img.src = './img/walking-man-sprite-800px.png';
  return img;
};

class WalkingMan {
  constructor() {
    this.canvas = createCanvas();
    this.cx = this.canvas.getContext('2d');
    this.img = createImage();
    this.tile = 0;
  }
  animateNextFrame() {
    let tileX = this.tile * 100;
    this.cx.clearRect(0, 0, 100, 116);
    this.cx.drawImage(this.img, tileX, 0, 80, 116, 0, 0, 80, 116);
    this.tile = this.tile < 7 ? this.tile + 1 : 0;
  }
}

export default WalkingMan;
