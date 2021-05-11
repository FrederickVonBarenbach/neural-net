class NeuralNetwork {
  //hiddenLayers is an array of integers corresponding to how many nodes
  //there should be per layer
  //i.e. [2, 3, 2] means that there are 3 hidden layers with 2, 3, and 2
  //     nodes respectively
  //NOTE: hiddenLayers can also take the form of an integer if there is only
  //      one hidden layers (in which case it will correspond to the number
  //      of nodes in the layer)
  //NOTE: if the value is 0, there is no hidden layer
  constructor(inputs, hiddenLayers, outputs) {
    this.layers = []; //Each element is a vector corresponding to the in/output
                      //i.e. layers[0] is the inputs
    this.consts = []; //Each element is a vector corresponding to the
                         //constants at the layer of the same index
    this.weights = []; //Each element is a matrix corresponding to the weights
                       //of connections from the layer at the same index and
                       //the next layer
                       //i.e. weights[0] corresponds to the weights from
                       //     layers[0] to layers[1]

    //Set up inputs
    this.layers.push(new Matrix(inputs, 1, 1));
    //Set up hidden layers
    if (Array.isArray(hiddenLayers)) {
      for (let i = 0; i < hiddenLayers.length; i++) {
        this.layers.push(new Matrix(hiddenLayers[i], 1, 1));
        this.consts.push(new Matrix(hiddenLayers[i], 1));
        this.weights.push(new Matrix(this.layers[i+1].size(),
                                     this.layers[i].size()));
      }
    } else if (hiddenLayers > 0) {
      this.layers.push(new Matrix(hiddenLayers, 1, 1));
      this.consts.push(new Matrix(hiddenLayers, 1));
      this.weights.push(new Matrix(this.layers[1].size(),
                                   this.layers[0].size()));
    }
    //Set up outputs
    this.layers.push(new Matrix(outputs, 1, 1));
    this.consts.push(new Matrix(outputs, 1));
    this.weights.push(new Matrix(this.layers[this.layers.length-1].size(),
                                 this.layers[this.layers.length-2].size()));
  }

  //arg: (array) inputs
  //returns: vector corresponding to outputs
  feedForward(inputs) {
    if (inputs.length == this.layers[0].size()) {
      this.layers[0] = Matrix.fromArray(inputs);
      for (let i = 0; i < this.layers.length-1; i++) {
        //W*A
        let product = Matrix.product(this.weights[i], this.layers[i]);
        //W*A + B
        product.add(this.consts[i]);
        //sigmoid(W*A + B)
        product.map(Functions.sigmoid);

        this.layers[i+1] = product;
      }
      return this.layers[this.layers.length-1];
    } else {
      throw new Error("(input error) incorrect number of inputs");
    }
  }

  //arg: (array) inputs
  //does: trains the neural network by adjusting weights
  train(inputs, expectedArr) {
    let outputs = this.feedForward(inputs);
    let expected = Matrix.fromArray(expectedArr);

    //Calculating dynamic (experimental) learning rate
    let totalCost = Matrix.fromArray(expectedArr)
                          .subtract(outputs)
                          .map((x) => {return Math.pow(x, 2);})
                          .multiply(0.5);
    let learningRate = 1000*Math.pow(totalCost.data[0][0],0.5);

    //Calculating output error
    let cost = outputs.subtract(expected);
    let quantity = Matrix.product(this.weights[this.weights.length-1],
                                  this.layers[this.weights.length-1])
                         .add(this.consts[this.weights.length-1]);
    let outError = Matrix.hadamardProduct(cost,
                                          quantity.map(Functions.dSigmoid));
    let errors = new Array(this.weights.length);
    errors[this.weights.length-1] = outError;

    //Calculating hidden layer errors
    for (let i = this.weights.length-2; i >= 0; i--) {
      cost = Matrix.product(Matrix.transpose(this.weights[i+1]),
                            errors[i+1]);
      quantity = Matrix.product(this.weights[i],
                                this.layers[i])
                       .add(this.consts[i]);
      errors[i] = Matrix.hadamardProduct(cost,
                                         quantity.map(Functions.dSigmoid));
    }

    //Calculating and subtracting dC/dw and dC/db from previous weights
    //and consts
    for (let i = this.weights.length-1; i >= 0; i--) {
      let dw = Matrix.product(errors[i], Matrix.transpose(this.layers[i]))
                     .multiply(learningRate);
      let db = errors[i].multiply(learningRate);
      this.weights[i].subtract(dw);
      this.consts[i].subtract(db);
    }
  }
}

class Functions {
  static sigmoid(x) {
    return 1/(1+Math.exp(-x));
  }

  static dSigmoid(x) {
    return Functions.sigmoid(x)*(1-Functions.sigmoid(x));
  }
}
