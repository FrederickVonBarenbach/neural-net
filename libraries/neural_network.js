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
    //Set up hidden layers (we are using He initialization of weights)
    if (Array.isArray(hiddenLayers)) {
      for (let i = 0; i < hiddenLayers.length; i++) {
        this.layers.push(new Matrix(hiddenLayers[i], 1));
        this.consts.push(new Matrix(hiddenLayers[i], 1, 0));
        this.weights.push(new Matrix(this.layers[i+1].size(),
                                     this.layers[i].size())
                                    .randomize(2, Math.sqrt(2/this.layers[i].size())));
      }
    } else if (hiddenLayers > 0) {
      this.layers.push(new Matrix(hiddenLayers, 1));
      this.consts.push(new Matrix(hiddenLayers, 1, 0));
      this.weights.push(new Matrix(this.layers[1].size(),
                                   this.layers[0].size())
                                  .randomize(2, Math.sqrt(2/this.layers[0].size())));
    }
    //Set up outputs
    this.layers.push(new Matrix(outputs, 1));
    this.consts.push(new Matrix(outputs, 1, 0));
    let last = this.layers.length-1;
    this.weights.push(new Matrix(this.layers[last].size(),
                                 this.layers[last-1].size())
                                .randomize(2, Math.sqrt(2/this.layers[last-1].size())));
  }

  //============================================================================

  //arg: (array) inputs
  //returns: vector corresponding to outputs
  feedForward(input) {
    if (input.length == this.layers[0].size()) {
      this.layers[0] = Matrix.fromArray(input);
      for (let i = 0; i < this.layers.length-1; i++) {
        //z = w * a_prev + b
        let product = Matrix.product(this.weights[i], this.layers[i])
                            .add(this.consts[i]);
        //a_next = sigmoid(z)
        product.map(Functions.sigmoid);
        this.layers[i+1] = product;
      }
      return Matrix.copy(this.layers[this.layers.length-1]);
    } else {
      throw new Error("(input error) incorrect number of inputs");
    }
  }

  //arg: (array) set is an array of objects of the following form:
  //                input: X, (where X is an array of input data)
  //                label: Y  (where Y is an array of expected output data)
  //     (number) number of runs before adjusting weights
  //does: trains the network by adjusting weights after batchSize number of runs
  trainBatch(set, batchSize) {
    for (let i = 0; i < batchSize; i++) {
      let index = Math.floor(Math.random()*set.length);
      this.backpropagate(set[index].input, set[index].label, batchSize);
    }
  }

  //arg: (array) inputs
  //does: backpropagates changes to weights throughout neural network
  backpropagate(input, label, batchSize = 1) {
    let outputs = this.feedForward(input);

    //Calculating output error
    //dC = y - a_output
    let dCost = outputs.subtract(Matrix.fromArray(label));

    //z_out = w * a_prev + b
    let quantity = Matrix.product(this.weights[this.weights.length-1],
                                  this.layers[this.weights.length-1])
                         .add(this.consts[this.weights.length-1]);
    //NOTE: error is represented by the delta symbol
    //error_out = dC ⊙ dSigmoid(z_out)
    let outError = Matrix.hadamardProduct(dCost,
                                          quantity.map(Functions.dSigmoid));

    //Calculating [EXPERIMENTAL] adaptive learning rate which decreases as cost
    //average is minimized. It is possible to try to add momentum to learning
    //rate.
    //C = 1/2 * (dC_avg)^2
    let cost = Matrix.copy(dCost)
                     .map((x) => {return Math.pow(x, 2);})
                     .multiply(0.5);
    //NOTE: The learning rate should not change depending on cost for non-batch
    //      training since it reverses the process every time a different set is
    //      inputted.
    //l = 10 * C_avg + 0.01
    let cost_avg = 0;
    cost.iterate((x, y) => {cost_avg += cost.data[x][y]/cost.size();});
    let learningRate = cost_avg*10 + 1;

    //Initializing error array to hold error of each layer
    //(adding output error to end)
    let errors = new Array(this.weights.length);
    errors[this.weights.length-1] = outError;

    //Calculating hidden layer errors
    for (let i = this.weights.length-2; i >= 0; i--) {
      //dC = w_T * error_next
      dCost = Matrix.product(Matrix.transpose(this.weights[i+1]),
                            errors[i+1]);
      //z = w * a_prev + b
      quantity = Matrix.product(this.weights[i],
                                this.layers[i])
                       .add(this.consts[i]);
      //error = dC ⊙ dSigmoid(z)
      errors[i] = Matrix.hadamardProduct(dCost,
                                         quantity.map(Functions.dSigmoid));
    }

    //Calculating and subtracting dC/dw and dC/db from previous weights
    //and consts
    for (let i = this.weights.length-1; i >= 0; i--) {
      //dC/dw = l * (error * a_prev_T)
      let dw = Matrix.product(errors[i], Matrix.transpose(this.layers[i]))
                     .multiply(learningRate/batchSize);
      //dC/db = l * (error)
      let db = Matrix.copy(errors[i]).multiply(learningRate/batchSize);
      this.weights[i].subtract(dw);
      this.consts[i].subtract(db);
    }
  }
}

//==============================================================================

class Functions {
  static sigmoid(x) {
    return 1/(1+Math.exp(-x));
  }

  static dSigmoid(x) {
    return Functions.sigmoid(x)*(1-Functions.sigmoid(x));
  }
}
