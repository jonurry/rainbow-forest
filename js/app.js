let canvases;
let canvasMan;
let counter;
let cxMan;
let imgMan;
let queue;
let screenHeight;
let screenWidth;
let tile;
let treeDimension;

const createTreeCanvas = () => {
  let canvas;
  canvas = document.createElement('canvas');
  canvas.style.left = `${screenWidth - treeDimension}px`;
  canvas.height = treeDimension;
  canvas.width = Math.floor(treeDimension * 1.3);
  document.body.appendChild(canvas);
  return canvas;
};

const drawMan = () => {
  let tileX = tile * 100 - 20;
  cxMan.clearRect(0, 0, 100, 116);
  cxMan.drawImage(imgMan, tileX, 0, 80, 116, 0, 0, 80, 116);
  tile = tile < 7 ? (tile += 1) : 0;
};

const drawTree = (cx, length, angle, scale) => {
  queueAdd(() => {
    cx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;
  });
  queueAdd(() => {
    cx.fillRect(-length / 20, 0, length / 10, length);
  });
  if (length < 8) return;
  queueAdd(() => {
    cx.save();
  });
  queueAdd(() => {
    cx.translate(0, length);
  });
  queueAdd(() => {
    cx.rotate(-angle + (Math.random() - 0.5) / 3);
  });
  drawTree(cx, length * scale, angle, scale);
  queueAdd(() => {
    cx.rotate(2 * angle + (Math.random() - 0.5) / 3);
  });
  drawTree(cx, length * scale, angle, scale);
  queueAdd(() => {
    cx.restore();
  });
};

const flipVertically = (context, around) => {
  context.translate(0, around);
  context.scale(1, -1);
  context.translate(0, -around);
};

const initialise = () => {
  setupCanvas();
  setupListeners();
  resize();
  canvases = [];
  counter = Math.floor(treeDimension / 4);
  imgMan = document.createElement('img');
  imgMan.src = './img/walking-man-sprite-800px.png';
  queue = [];
  tile = 0;
};

function noScroll() {
  window.scrollTo(0, 0);
}

const queueAdd = fn => {
  queue.push(fn);
};

const queueExecuteNext = () => {
  // execute the next function in the queue
  if (queue.length > 0) {
    queue.shift()();
  }
};

const resize = () => {
  screenHeight = Math.round(document.documentElement.clientHeight);
  screenWidth = Math.round(document.documentElement.clientWidth);
  treeDimension = Math.round(
    (screenHeight > screenWidth ? screenWidth : screenHeight) * 2 / 3
  );
  canvasMan.style.top = `${Math.round(screenHeight / 6 * 5 - 100)}px`;
  canvasMan.style.left = `${Math.round(screenWidth / 10)}px`;
};

const runAnimation = frameFunc => {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

const setupCanvas = () => {
  canvasMan = document.getElementById('canvasMan');
  canvasMan.width = 80;
  canvasMan.height = 116;
  canvasMan.style.zIndex = 99;
  cxMan = canvasMan.getContext('2d');
};

const setupListeners = () => {
  // disable scroll
  window.addEventListener('scroll', noScroll);
  // resize and position elements
  window.addEventListener('resize', resize);
};

initialise();

runAnimation(() => {
  let canvasTree;
  let cxTree;
  let randomAngle;
  let randomLength;
  let randomScale;
  // scroll trees left by one pixel
  canvases.forEach(element => {
    element.style.left = `${parseInt(element.style.left, 10) - 1}px`;
    if (parseInt(element.style.left, 10) < -element.width) {
      element.remove();
      canvases.shift();
    }
  });
  counter--;
  // draw a new tree once space is available
  // all drawing instructions are calculated and queued
  // for future rendering
  if (Math.round(counter) == 0) {
    randomAngle = Math.random() * 0.6 + 0.2;
    randomLength = Math.floor(
      Math.floor(Math.random() * treeDimension / 6) + treeDimension / 18
    );
    randomScale = Math.random() * 0.1 + 0.7;
    canvasTree = createTreeCanvas();
    canvases.push(canvasTree);
    cxTree = canvasTree.getContext('2d');
    flipVertically(cxTree, treeDimension / 2);
    cxTree.translate(treeDimension * 1.3 / 2, 0);
    drawTree(cxTree, randomLength, randomAngle, randomScale);
    counter = treeDimension;
  }
  // animate the man every 10 pixels scrolled
  if (counter % 10 == 0) {
    drawMan();
  }
  // draw part of the tree
  // complex trees with lots of queued drawing instructions
  // are rendered faster than less complex trees
  for (let i = 0; i < queue.length / (counter == 0 ? 1 : counter); i++) {
    queueExecuteNext();
  }
});
