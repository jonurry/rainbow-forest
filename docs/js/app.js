import RainbowTree from './rainbow-tree.js';
import Queue from './queue.js';
import WalkingMan from './walking-man.js';

(global => {
  let canvases;
  let counter;
  let queue;
  let man;
  let screenHeight;
  let screenWidth;
  let treeDimension;

  const initialise = () => {
    canvases = [];
    queue = new Queue();
    man = new WalkingMan();
    global.document.body.appendChild(man.canvas);
    setupListeners();
    resize();
    counter = Math.floor(treeDimension / 4);
  };

  function noScroll() {
    global.scrollTo(0, 0);
  }

  const resize = () => {
    screenHeight = Math.round(document.documentElement.clientHeight);
    screenWidth = Math.round(document.documentElement.clientWidth);
    treeDimension = Math.round(
      (screenHeight > screenWidth ? screenWidth : screenHeight) * 2 / 3
    );
    man.canvas.style.top = `${Math.round(screenHeight / 6 * 5 - 100)}px`;
    man.canvas.style.left = `${Math.round(screenWidth / 10)}px`;
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

  const setupListeners = () => {
    // disable scroll
    global.addEventListener('scroll', noScroll);
    // resize and position elements
    global.addEventListener('resize', resize);
  };

  initialise();

  runAnimation(() => {
    let rainbowTree;
    let randomAngle;
    let randomLength;
    let randomScale;
    // scroll trees left by one pixel
    for (let i = canvases.length - 1; i >= 0; i--) {
      canvases[i].canvas.style.left = `${parseInt(
        canvases[i].canvas.style.left,
        10
      ) - 1}px`;
      // if tree has scrolled off the screen then remove it
      if (parseInt(canvases[i].canvas.style.left, 10) < -canvases[i].width) {
        canvases[i].cx.clearRect(0, 0, canvases[i].width, canvases[i].height);
        document.body.removeChild(canvases[i].canvas);
        canvases[i] = null;
        canvases.splice(i, 1);
      }
    }
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
      rainbowTree = new RainbowTree(treeDimension);
      rainbowTree.canvas.style.left = `${screenWidth - treeDimension / 1.5}px`;
      document.body.appendChild(rainbowTree.canvas);
      canvases.push(rainbowTree);
      rainbowTree.drawToQueue(queue, randomLength, randomAngle, randomScale);
      counter = treeDimension;
    }
    // animate the man every 10 pixels scrolled
    if (counter % 10 == 0) {
      man.animateNextFrame();
    }
    // draw part of the tree
    // complex trees with lots of queued drawing instructions
    // are rendered faster than less complex trees
    for (let i = 0; i < queue.length / (counter == 0 ? 1 : counter); i++) {
      queue.executeNext();
    }
  });
})(window);
