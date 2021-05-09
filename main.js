//in console: php -S localhost:8000
//in chrome: http://localhost:8000/Documents/GitHub/perlyne/index.html

function preload() {
}

function setup() {
  let matrix1 = new Matrix(2, 2);
  matrix1.data[0][0] = 11;
  matrix1.data[1][0] = 3;
  matrix1.data[0][1] = 7;
  matrix1.data[1][1] = 11;

  let matrix2 = new Matrix(2, 3);
  matrix2.data[0][0] = 8;
  matrix2.data[1][0] = 0;
  matrix2.data[2][0] = 1;
  matrix2.data[0][1] = 0;
  matrix2.data[1][1] = 3;
  matrix2.data[2][1] = 5;

  matrix1.print();
  matrix2.print();

  Matrix.multiply(matrix1, matrix2).print();
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
