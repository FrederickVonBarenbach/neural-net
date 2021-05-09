class Matrix {
  constructor(rows, cols, default_val = 0) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let x = 0; x < this.cols; x++) {
      this.data[x] = [];
      for (let y = 0; y < this.rows; y++) {
        this.data[x][y] = default_val;
      }
    }
  }

  //arg: (array) 1 dimensional array
  //     (boolean) whether or not the matrix is vertical
  //returns: Matrix object created from array
  static fromArray(array, vertical = true) {
    if (vertical) {
      let matrix = new Matrix(array.length, 1);
      for (let y = 0; y < matrix.rows; y++) {
        matrix.data[0][y] = array[y];
      }
    } else {
      let matrix = new Matrix(1, array.length);
      for (let x = 0; x < matrix.cols; x++) {
        matrix.data[x][0] = array[x];
      }
    }
    return matrix;
  }

  //arg: (matrix) first matrix
  //     (matrix) second matrix
  //returns: Matrix object created from cross product of matrices
  static multiply(m1, m2) {
    if (m1.cols == m2.rows) {
      let matrix = new Matrix(m1.rows, m2.cols);
      for (let x = 0; x < matrix.cols; x++) {
        for (let y = 0; y < matrix.rows; y++) {
          let sum = 0;
          for (let i = 0; i < m1.rows; i++) {
            sum += m1.data[i][y]*m2.data[x][i];
          }
          matrix.data[x][y] = sum;
        }
      }
      return matrix;
    } else {
      throw new Error("(multiplication error) matrices of not correct size");
    }
  }

  //arg: (matrix) first matrix
  //     (matrix) second matrix
  //returns: Matrix object created from cross product of matrices
  /*static multiply(m1, m2) {
    if (m1.cols == m2.rows) {
      let matrix = new Matrix(m1.rows, m2.cols);
      for (let x = 0; x < matrix.cols; x++) {
        for (let y = 0; y < matrix.rows; y++) {
          let sum = 0;
          for (let i = 0; i < m1.rows; i++) {
            sum += m1.data[i][y]*m2.data[x][i];
          }
          matrix.data[x][y] = sum;
        }
      }
      return matrix;
    } else {
      throw new Error("(multiplication error) matrices of not correct size");
    }
  }*/

  iterate(func1, func2 = () => {}) {
    for (let x = 0; x < this.cols; x++) {
        func2(x, y);
      for (let y = 0; y < this.rows; y++) {
        func1(x, y);
      }
    }
  }

  print() {
    for (let y = 0; y < this.rows; y++) {
      let str = "";
      str += "[";
      for (let x = 0; x < this.cols; x++) {
        str += this.data[x][y];
        str += x < this.cols-1 ? ", " : "";
      }
      str += "]";
      console.log(str);
    }
  }
}
