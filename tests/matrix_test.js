function runMatrixTests() {
  //Product test
  let matrix1 = Matrix.fromArray([[11, 3],
                                  [7, 11]], false);
  let matrix2 = Matrix.fromArray([[8, 0, 1],
                                  [0, 3, 5]], false);
  let out = Matrix.product(matrix1, matrix2);
  let expected = Matrix.fromArray([[88, 9, 26],
                                   [56, 33, 62]], false);
  console.log("Matrix Product Test 1:   %s", out.equals(expected) ? "succeeded" : "failed");
  matrix1 = Matrix.fromArray([[11, 3, 4],
                              [7, 11, 10]], false);
  matrix2 = Matrix.fromArray([[8, 0],
                              [0, 3],
                              [5, 2]], false);
  out = Matrix.product(matrix1, matrix2);
  expected = Matrix.fromArray([[108, 17],
                               [106, 53]], false);
  console.log("Matrix Product Test 2:   %s", out.equals(expected) ? "succeeded" : "failed");

  //Multiply test
  matrix1 = Matrix.fromArray([[11, 3],
                              [7, 11]], false);
  matrix1.multiply(2);
  expected = Matrix.fromArray([[22, 6],
                               [14, 22]], false);
  console.log("Multiply Test:           %s", matrix1.equals(expected) ? "succeeded" : "failed");

  //Add test
  matrix1.add(matrix1);
  expected = Matrix.fromArray([[44, 12],
                               [28, 44]], false);
  console.log("Add Test:                %s", matrix1.equals(expected) ? "succeeded" : "failed");

  //Subtraction test
  matrix1.subtract(matrix1);
  expected = Matrix.fromArray([[0, 0],
                               [0, 0]], false);
  console.log("Subtraction Test:        %s", matrix1.equals(expected) ? "succeeded" : "failed");


  //Transpose test
  matrix1 = Matrix.fromArray([[44, 12],
                              [28, 44]], false);
  out = Matrix.transpose(matrix1);
  expected = Matrix.fromArray([[44, 28],
                               [12, 44]], false);
  console.log("Transpose Test:          %s", out.equals(expected) ? "succeeded" : "failed");

  //Hadamard product test
  let vector1 = Matrix.fromArray([1, 2, 3]);
  let vector2 = Matrix.fromArray([4, 5, 6]);
  out = Matrix.hadamardProduct(vector1, vector2);
  expected = Matrix.fromArray([4, 10, 18]);
  console.log("Hadamard Product Test:   %s", out.equals(expected) ? "succeeded" : "failed");
}
