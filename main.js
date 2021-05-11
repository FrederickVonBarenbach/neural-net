//in console: php -S localhost:8000
//in chrome: http://localhost:8000/Documents/GitHub/perlyne/index.html

function preload() {
  runMatrixTests();
}

function setup() {
  let nn = new NeuralNetwork(2, 1, 1);
  nn.feedForward([0, 1]).print();
  for (let i = 0; i < 1000; i++) {
    nn.train([0, 1], [1]);
  }
  nn.feedForward([0, 1]).print();
  //createCanvas(w, h);
}

function draw() {
  //displayBackground();
  //fill('red')
  //text(frameRate().toFixed(0), width-100, 10);
}

/*  if (this.x*z > -w/2+(camX-radius*2)*z && this.x*z < w/2+(camX+radius*2)*z
   && this.y*z > -h/2+(camY-radius*2)*z && this.y*z < h/2+(camY+radius*2)*z) */

/*
   //Sort array -> array ascending y value
   function compare(a, b) {
     let comparison = 0;
     if (a.y > b.y) {
       comparison = 1;
     } else {
       comparison = -1;
     }
     return comparison;
   }


   print(arr.sort(compare));*/
