//in console: php -S localhost:8000
//in chrome: http://localhost:8000/Documents/GitHub/neural-net/index.html

function preload() {
  runMatrixTests();
}

function setup() {

  /*var trainingSet = [{input: [0, 0],
                      label: [0]},
                     {input: [0, 1],
                      label: [1]},
                     {input: [1, 0],
                      label: [1]},
                     {input: [1, 1],
                      label: [0]}];

  let nn = new NeuralNetwork(2, 3, 1);
  for (let i = 0; i < 5000; i++) {
    nn.trainBatch(trainingSet, 2);
  }
  nn.feedForward([0, 0]).print();
  nn.feedForward([0, 1]).print();
  nn.feedForward([1, 0]).print();
  nn.feedForward([1, 1]).print();*/

  beeProblem();
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
