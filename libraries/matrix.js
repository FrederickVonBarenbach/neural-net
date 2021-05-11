const randRange = 1;

class Matrix {
  //default_val can take the form of the string "random" to denote that the
  //elements of the matrix should be randomized, or it can take the form of a
  //number in which case all elements of the matrix will become default_val
  constructor(rows, cols, default_val = "random") {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    let random = false;
    if (default_val == "random") {
      random = true;
      default_val = 0;
    }

    for (let x = 0; x < this.cols; x++) {
      this.data[x] = [];
      for (let y = 0; y < this.rows; y++) {
        this.data[x][y] = default_val;
      }
    }

    if (random) {
      this.randomize();
    }
  }

  //arg: (array) 2 dimensional array
  //     (boolean) whether or not the array should be interpreted as transposed
  //               (default is true since we mostly want to convert arrays to
  //               vertical vectors)
  //returns: matrix object created from array
  static fromArray(array, transpose = true) {
    if (array.length == 0) return new Matrix(0, 0);

    let twoDim = Array.isArray(array[0]);
    let rows = twoDim ? array.length : 1;
    let cols = twoDim ? array[0].length : array.length;
    let matrix = new Matrix(rows, cols);

    matrix.iterate((x, y) => {
      matrix.data[x][y] = rows == 1 ? array[x] : array[y][x];
    });

    return transpose ? Matrix.transpose(matrix) : matrix;
  }

  //============================================================================

  //arg: (matrix) first matrix
  //     (matrix) second matrix
  //returns: matrix object created from cross product of matrices
  // FIX THIS LOL
  static product(m1, m2) {
    if (m1.cols == m2.rows) {
      let matrix = new Matrix(m1.rows, m2.cols);
      matrix.iterate((x, y) => {
        let sum = 0;
        for (let i = 0; i < m1.cols; i++) {
          sum += m1.data[i][y]*m2.data[x][i];
        }
        matrix.data[x][y] = sum;
      });
      return matrix;
    } else {
      throw new Error("(product error) matrices of not correct size");
    }
  }

  //arg: (matrix) matrix
  //returns: matrix object created from transpose of matrix
  static transpose(m) {
    let matrix = new Matrix(m.cols, m.rows);
    matrix.iterate((x, y) => {
      matrix.data[x][y] = m.data[y][x];
    });
    return matrix;
  }

  //arg: (vector) first vector
  //     (vector) second vector
  //returns: matrix object created from Hadamard product of matrices
  //         (this means elementwise multiplication)
  static hadamardProduct(v1, v2) {
    if (v1.rows == v2.rows && v1.cols == 1 && v2.cols == 1) {
      let vector = new Matrix(v1.rows, 1);
      vector.iterate((x, y) => {
        vector.data[x][y] = v1.data[x][y] * v2.data[x][y];
      });
      return vector;
    } else {
      throw new Error("(H. product error) non-vectors or not similar length");
    }
  }

  //arg: (number) value
  //does: multiplies this matrix by value n
  multiply(n) {
    this.iterate((x, y) => {
      this.data[x][y] *= n;
    });
    return this;
  }

  //arg: (matrix) matrix
  //does: adds matrix m to this matrix
  add(m) {
    if (m.rows == this.rows && m.cols == this.cols) {
      this.iterate((x, y) => {
        this.data[x][y] += m.data[x][y];
      });
      return this;
    } else {
      throw new Error("(addition error) matrices of not similar size");
    }
  }

  //arg: (matrix) matrix
  //does: subtracts this matrix by matrix m
  subtract(m) {
    if (m.rows == this.rows && m.cols == this.cols) {
      this.iterate((x, y) => {
        this.data[x][y] -= m.data[x][y];
      });
      return this;
    } else {
      throw new Error("(subtraction error) matrices of not similar size");
    }
  }

  //arg: (function) mapping function
  //does: every element of matrix has function applied to it
  map(func) {
    this.iterate((x, y) => {
      this.data[x][y] = func(this.data[x][y]);
    });
    return this;
  }

  //does: every element of matrix is randomized within randRange
  randomize() {
    this.iterate((x, y) => {
      this.data[x][y] = Math.random()*(2*randRange) - randRange;
    });
    return this;
  }

  //============================================================================

  iterate(func1, func2 = () => {}) {
    for (let x = 0; x < this.cols; x++) {
        func2(x);
      for (let y = 0; y < this.rows; y++) {
        func1(x, y);
      }
    }
  }

  equals(m) {
    if (this.rows != m.rows || this.cols != m.cols) return false;
    this.iterate((x, y) => {
      if (this.data[x][y] != m.data[x][y]) return false;
    });
    return true;
  }

  size() {
    return this.rows*this.cols;
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
