class QLearning {
  //============================================================================
  //NEXT STEPS:
  //1) make it so that if it has not encountered a given state or has ties in
  //   the state, it will be more likely to act in the same way as in a state
  //   similar to this one (for example if the positions are the same but the
  //   "hasHoney" descriptor is false in one and true in another - this would
  //   be 1/2 similar)
  //============================================================================

  static timeLimit = 100;
  static decay = 0.5
  static learningRate = 1;
  static randProb = 0.2;

  //object is a class of the following construction:
  /*
    class Object {
      static actions = [Object.A, Object.B];
      constructor() {
         //meaning of descriptor1, meaning of descriptor2
        this.state = [descriptor1, descriptor2];
      }
      static A(object, wordy = false) {
        if (wordy) console.log("Words describing A");
      }
      static B(object, wordy = false) {
        if (wordy) console.log("Words describing B");
      }
    }
  */
  //rewards is an array of reward objects of the following construction:
  /*
  [{state: [X, Y], reward: Z, func: function(object) { ... }}];
  */
  //where X and Y represent the requirements in order to receive reward Z after
  //which point function "func" will be executed
  constructor(c, rewards) {
    this.qTable = []; //array of QPair
                      //actions are an array of scores for the possible actions
    this.rewards = rewards;
    this.Class = c;
  }

  //arg: (int) number of iterations to perform training
  //does: creates the object of class this.Class and then allows it to explore
  //      the world and records the rewards and penalities it receives for
  //      doing actions; at the end, a final instance will be created and the
  //      results will be printed as the "wordy" version of the actions
  //      (see reference of wordy in constructor)
  train(trainingIterations) {
    for (let n = 0; n < trainingIterations; n++) {
      //every iteration, make new bee and restart simulation
      var object = new this.Class();

      for (let t = 0; t < QLearning.timeLimit; t++) {
        //Get qPair with given state
        let qPair = this.getQPair(object.state);
        let index = 0;
        //if state hasn't been encountered yet, add it
        if (qPair == undefined) {
          qPair = new QPair(object.state, this.Class.actions.length);
          this.qTable.push(qPair);
        }

        //sometimes take random action
        if (Math.random() < QLearning.randProb) {
          index = Math.floor(Math.random()*this.Class.actions.length);
        } else {
          index = qPair.getAction();
        }

        //do action
        this.Class.actions[index](object, false);

        //get next state and if should quit
        let reward = -1;
        let quit = false;
        //NOTE: can add a quit boolean which will make the loop end
        for (let i = 0; i < this.rewards.length; i++) {
          if (QLearning.arrayEquals(object.state, this.rewards[i].state)) {
            reward += this.rewards[i].reward;
            if (this.rewards[i].func(object) == "EXIT") quit = true;
          }
        }
        qPair.actions[index] = (1-QLearning.learningRate)*qPair.actions[index]+
                               QLearning.learningRate*reward;

        let nextQPair = this.getQPair(object.state);
        //if state hasn't been encountered yet, add it
        if (nextQPair == undefined) {
          nextQPair = new QPair(object.state, this.Class.actions.length);
          this.qTable.push(nextQPair);
        }

        //update qPair's reward
        //NOTE: getting max reward might be expensive
        let nextReward = nextQPair.getMaxReward();
        qPair.updateReward(index, nextReward);

        if (quit) break;
      }
    }

    this.run();
    console.log("Finished");
  }

  //does: creates instance of this.Class and runs it
  run() {
    var object = new this.Class();
    for (let t = 0; t < QLearning.timeLimit; t++) {
      let qPair = this.getQPair(object.state);
      let index = 0;
      if (qPair == undefined) console.log("OH NO");
      index = qPair.getAction();
      this.Class.actions[index](object, true);
      let quit = false;
      for (let i = 0; i < this.rewards.length; i++) {
        if (QLearning.arrayEquals(object.state, this.rewards[i].state)) {
          if (this.rewards[i].func(object) == "EXIT") quit = true;
        }
      }
      if (quit) return;
    }
  }

  //arg: (array) array1
  //     (array) array2
  //returns: true if arrays have the same elements
  static arrayEquals(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (let e = 0; e < arr1.length; e++) {
      if (arr1[e] != arr2[e]) return false;
    }
    return true;
  }

  //arg: (array) state descriptors
  //returns: QPair from qTable that has the given state
  getQPair(state) {
    for (let i = 0; i < this.qTable.length; i++) {
      if (QLearning.arrayEquals(this.qTable[i].state, state)) {
        return this.qTable[i];
      }
    }
    return undefined;
  }
}

//NOTE ABOUT INTERPOLATOR: You would basically have a function for the
//     continous set of states so for the bee example it
//     would just be a straight horizontal line. An interpolator would just
//     find points which have the greatest change in the function and then use
//     then as the discrete states
//     EX: https://zipcpu.com/img/dot-to-dot.png

//============================================================================

class QPair {
  //arg: (array) state descriptors (i.e. [posX, posY, ...])
  //     (int)   number of possible actions
  constructor(state, numActions) {
    this.state = Array.from(state);
    this.actions = new Array(numActions);
    //elements are objects of type representing the reward {imm: X, fut: Y}
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i] = 0;
    }
  }

  //returns: action to be performed - sorts through all possible actions and if
  //         there are ties, chooses random one from list of ties
  getAction() {
    let possibleActions = [];
    let index = 0;
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i] > this.actions[index]) {
        possibleActions = [];
        possibleActions.push(i);
      } else if (this.actions[i] == this.actions[index]) {
        possibleActions.push(i);
      }
    }
    return possibleActions[Math.floor(Math.random()*possibleActions.length)];
  }

  //returns: the reward associated with the actions leading to the best outcome
  getMaxReward() {
    let maxReward = this.actions[0];
    for (let i = 1; i < this.actions.length; i++) {
      if (this.actions[i] > maxReward) maxReward = this.actions[i];
    }
    return maxReward;
  }

  //arg: (int) index of the action taken
  //     (int) the reward associated with the actions possible in the next
  //           state (which is a result of the action taken)
  //does: updates the reward of the action taken
  updateReward(index, nextReward) {
    //not multiplying reward by learning rate because it should get updated
    //earlier (this.actions[index] is equal to Qscore_old + LR*reward)
    this.actions[index] = this.actions[index]+
                          QLearning.learningRate*QLearning.decay*(nextReward);
  }
}
