const timeLimit = 100;
const decay = 0.5
const learningRate = 1;
const randProb = 0.2;

var qTable = []; //array of QPair
                 //actions are an array of scores for the possible actions
var rewards = [{state: [0, false], reward: 100, func: function(bee) {
  bee.state[1] = true;
}}, {state: [10, true], reward: 1000, func: function(bee) {
  return "EXIT";
}}];

//TODO: try again except no neural nets this time, only 1 bee
//      1) make a q table with state, action, and score for each pair
//      2) intitialize with random values
//      3) take action with highest score
//      3.5) have some probabiltity to take random action (in order to explore
//           possible future rewards)
//      NOTE: this probability of taking random actions should reduce as we
//            become more sure of our q-function
//      4) get next state and record the immediate reward
//      NOTE: you should have reward as (immediate, future) so you can get max
//            future easily by comparing with current
//      5) apply a portion of the reward to the previous state if it's greater
//         than its current future reward
//      6) once we get the final reward, we can repeat from the start using the
//         same table

//NOTE ABOUT INTERPOLATOR: You would basically have a function for the
//     continous set of states so for the bee example it
//     would just be a straight horizontal line. An interpolator would just
//     find points which have the greatest change in the function and then use
//     then as the discrete states
//     EX: https://zipcpu.com/img/dot-to-dot.png

//arg: (array) state descriptors
//returns: QPair from qTable that has the given state
function getQPair(state) {
  for (let i = 0; i < qTable.length; i++) {
    if (arrayEquals(qTable[i].state, state)) return qTable[i];
  }
  return undefined;
}

//arg: (array) array1
//     (array) array2
//returns: true if arrays have the same elements
function arrayEquals(arr1, arr2) {
  if (arr1.length != arr2.length) return false;
  for (let e = 0; e < arr1.length; e++) {
    if (arr1[e] != arr2[e]) return false;
  }
  return true;
}

function beeProblem() {
  var trainingIterations = 100;
  for (let n = 0; n < trainingIterations; n++) {
    //every iteration, make new bee and restart simulation
    var bee = new Bee();

    for (let t = 0; t < timeLimit; t++) {
      //Get qPair with given state
      let qPair = getQPair(bee.state);
      let index = 0;
      //if state hasn't been encountered yet, add it
      if (qPair == undefined) {
        //ERROR: it creates the qPair with the state as a reference of the bee's
        //       state, it should be instatiated as a copy of the array
        qPair = new QPair(bee.state, Bee.actions.length);
        qTable.push(qPair);
      }

      //sometimes take random action
      if (Math.random() < randProb) {
        index = Math.floor(Math.random()*Bee.actions.length);
      } else {
        index = qPair.getAction();
      }

      //do action
      Bee.actions[index](bee, false);

      //get next state and if should quit
      let reward = -1;
      let quit = false;
      //NOTE: can add a quit boolean which will make the loop end
      for (let i = 0; i < rewards.length; i++) {
        if (arrayEquals(bee.state, rewards[i].state)) {
          reward += rewards[i].reward;
          if (rewards[i].func(bee) == "EXIT") quit = true;
        }
      }
      qPair.actions[index] = (1-learningRate)*qPair.actions[index]+
                             learningRate*reward;

      let nextQPair = getQPair(bee.state);
      //if state hasn't been encountered yet, add it
      if (nextQPair == undefined) {
        nextQPair = new QPair(bee.state, Bee.actions.length);
        qTable.push(nextQPair);
      }

      //update qPair's reward
      //NOTE: getting max reward might be expensive
      let nextReward = nextQPair.getMaxReward();
      qPair.updateReward(index, nextReward);

      if (quit) break;
    }
  }

  runBee();
  console.log("Finished");
}

function runBee() {
  var bee = new Bee();
  for (let t = 0; t < timeLimit; t++) {
    let qPair = getQPair(bee.state);
    let index = 0;
    if (qPair == undefined) console.log("OH NO");
    index = qPair.getAction();
    Bee.actions[index](bee, true);
    let quit = false;
    for (let i = 0; i < rewards.length; i++) {
      if (arrayEquals(bee.state, rewards[i].state)) {
        if (rewards[i].func(bee) == "EXIT") quit = true;
      }
    }
    if (quit) return;
  }
}

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
  getMaxReward() {
    let maxReward = this.actions[0];
    for (let i = 1; i < this.actions.length; i++) {
      if (this.actions[i] > maxReward) maxReward = this.actions[i];
    }
    return maxReward;
  }
  updateReward(index, nextReward) {
    //not multiplying reward by learning rate because it should get updated
    //earlier (this.actions[index] is equal to Qscore_old + LR*reward)
    this.actions[index] = this.actions[index]+learningRate*decay*(nextReward);
  }
}

class Bee {
  static actions = [Bee.wait, Bee.goLeft, Bee.goRight];
  constructor() {
    this.state = [5, false]; //position, hasHoney
  }
  static wait(bee, wordy = false) {
    if (wordy) console.log("waiting at pos:     " + bee.state[0]);
  }
  static goLeft(bee, wordy = false) {
    bee.state[0] -= 1;
    if (wordy) console.log("going left to pos:  " + bee.state[0]);
  }
  static goRight(bee, wordy = false) {
    bee.state[0] += 1;
    if (wordy) console.log("going right to pos: " + bee.state[0]);
  }
}
