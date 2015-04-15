/**
 * Created by andreas on 09.04.15.
 */
import Immutable from 'immutable';

/**
 *  This graph like data structure can be used to predict the next input values based on the inputs
 *  already seen. Prediction is made by recording the sequences of values entered by clients
 *  to keep track of their overall distribution. Each input value is treated as the successor of all
 *  preceding inputs coming from the same sequence (= same client).
 *
 *  A sequence is an ordered collection of inputs ŕecorded in the same order as they occurred. Each node
 *  in the structure is a associated with exactly one distinct set of values up to cardinality 4. A node can have multiple
 *  outgoing and incoming edges. More precisely: A node may have as many
 *   a.) outgoing edges as there are distinct supersets with a cardinal value of +1 of the nodes value
 *   b.) incoming edges as there are distinct subsets with a cardinal value of -1 of the nodes value
 *
 *  Each node has a counter representing the number of visits made to that node. Each edge has a counter
 *  used to count the number of traverses.
 *
 */


/**
 *  The tree consists of a root node and all nodes corresponding to all subsets of inputs made by any user of
 *  cardinality smaller equal 4.
 */

export class GTrie {

  constructor(depth = 3) {
    // Maps node values to their nodes
    this.valueToNode = Immutable.Map();
    var factory = (value) => {
      if (this.valueToNode.has(value)) {
        return this.valueToNode.get(value);
      } else {
        var node = new Node(value, factory);
        this.valueToNode = this.valueToNode.set(value, node);
        return node;
      }
    };
    // The root node contains the empty set and is the entry point for tree operations
    this.root = new Node(Immutable.Set(), factory);
    this.depth = 3;
  }

  // The remembers the number of sequences, i.e. the number of users
  sequencecount() {
    return this.root.counter;
  }

  sequence() {
    // add this.depth here
    this.root.counter++;
    return new Sequence(this.root, this.depth);
  }
}

/**
 * Sequence manages the sequence of inputs and thei effect on the tree
 */
class Sequence {

  // BD: we discussed that depth is actually a property of the tree and not the sequence
  constructor(root, depth) {
    this.inputs = [];
    this.prediction = {input: 'no prediction', score: 0}; // should be a parameter using a default value
    this.tree = { root: root, depth: depth};
    this.predictingSubsets = Immutable.Set();
    this.subsetGenerator =  new SubsetGenerator();
  }


  // Each new input triggers a numbert of changes. It gets stored in the array this.inputs and the tree and the
  // prediction for the next input get updated.
  input(input) {
    var inputcardinality = this.inputs.length;
    var subsetcardinality = Math.min(this.tree.depth, inputcardinality);



    // we remember each input value
    this.inputs.push(input);

    // the new input might equal the current prediction, in that case the second best prediction is obtained
    if(this.prediction.input=== input) {
      this.prediction = {input: 'no prediction', score: 0};
      for (var subset of this.predictingSubsets) {
        var nodePrediction = this.tree.root.getNode(subset).predict().getprediction(0);
        if (nodePrediction.score > this.prediction.score
          && this.inputs.indexOf(nodePrediction.prediction) === -1) {
          this.prediction.input = nodePrediction.prediction;
          this.prediction.score = nodePrediction.score;
        }
      }
    }

    // update tree:
    // first receive all subsets of the set of inputs that contain the last input are of cardinality of at most depth +1
    var Subsets = this.subsetGenerator.build(this.inputs, subsetcardinality, Immutable.Set.of(input));


    for (var subset of Subsets) {
      // update Nodes and Edges of tree:
      this.tree.root.getNode(subset).activate();

      // if the cardinality of the subset is smaller equal depth it can be used for prediction of next input
      if(subset.size <= this.tree.depth) {

        // obtain prediction of the subset's node
        var nodePrediction = this.tree.root.getNode(subset).predict().getprediction(0);

        //we remember each potentially vital predicting subset
        if(nodePrediction.score> 0
          && this.inputs.indexOf(nodePrediction.prediction.input)=== -1){
          this.predictingSubsets = this.predictingSubsets.add(subset);
        }

        //if it is the current best prediction it is stored as predictor
        if (nodePrediction.score > this.prediction.score
          && this.inputs.indexOf(nodePrediction.prediction)=== -1){
          this.prediction.input = nodePrediction.prediction;
          this.prediction.score = nodePrediction.score;
        }

      }
    }
    return this;
  }

  predict() {
    return this.prediction;
  }

  allInputs() {
    return this.inputs;
  }

  numberofSubsets(){
    return this.predictingSubsets.size;
  }


}


/**
 * The nodes of the tree correspond to the subsets of the inputs made by the users. They predict the most likely next
 * input given the inputs of the subset the node corresponds to.
 */
class Node {

  constructor(val = Immutable.Set(), factory = (value) => new Node(value)) {
    this.outgoing = Immutable.Map();// projection from any => Edge
    this.val = val;
    this.counter = 0;
    this.getNode = factory;
  }

  next(input) {
    this.counter++; // record this visit
    if (this.outgoing.has(input)) {
      // input has already been seen on this node
      // thus there is a Edge to the target node with the value {val,input}
      return this.outgoing.get(input).targets();
    }
    else {
      // input is new in this branch
      let newValue = this.val.add(input);

      // the node might have been created in another path (a permutation of the input values)
      var node = this.getNode(newValue);


      this.outgoing = this.outgoing.set(input, new Edge(this, node)); // add input => Edge(source -> target) to
      // outgoing of this node's Edges
      return node;
    }
  }


  // When a node gets activated each of its parents' counters increase by one and their respective links to this node
  // aswell
  activate() {
    // iterate through items in this nodes value
    // and construct super sets of lower (-1) cardinality
    for (var input of this.val) {
      var superset = this.val.filter(element => element !== input);
      this.getNode(superset).next(input);
    }
  }



  /**
   * Compute a set of expected upcoming input values (prediction) based on the recorded weights of the outgoing edges of this node.
   *
   * @param threshold The lower bound which needs to be surpassed by an input value to be considered as a reasonabel prediction
   * @returns {Predictions} An ordered collection of predictions whose values exceeds the given threshold
   */
  predict(threshold = 0.5) {
    var nodevisited = this.counter;

    var candidates = this.outgoing
      .map((link, input) => {
        return {
          prediction: input,
          score: link.counter / nodevisited
        }
      })
      .filter(x => x.score >= threshold)
      .sort((valueA, valueB) =>  valueA - valueB)
      .toArray();


    return new Predictions(candidates);
  }


}

/**
 * An array of predictions, engineered such that it outputs 'no prediction' whenever an empty entry is accessed
 */
class Predictions {

  constructor(candidates, defaultValue = {prediction: 'no prediction', score: 0}) {
    this.defaultValue = defaultValue;
    this.candidates = candidates;
  }

  getprediction(k) {
    return (this.candidates[k] !== undefined) ? this.candidates[k] : this.defaultValue;
  }

}


/**
 * Each node's incoming and outgoing links are encoded as array and Immutabel.Map respectively
 */
class Edge {

  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.counter = 1;
  }

  targets() {
    this.counter++;
    return this.target;
  }

}


/**
 *
 * There are several ways to extract from an array of entries all subsets up to a certain cardinality that contain a
 * specific element. The following class shall collect a few of them. The first "subsetsBrute" is the agnostic brute
 * force approach.
 *
 * BD: agnostic? Your mother is agnostic! Please improve these descriptions.
 *
 */

class SubsetGenerationStrategies{

  // BD: This algorithms lacks documentation
  //, Please describe each parameter and its function
  // as well as the major steps of the algorithm
  static bruteForce(aSet, cardinality, base) {
    //BD: It does not need to be immutable! Immutability refers to a different property of data structures,
    // i.e. that they can not be changed => any modification results in a new structure.
    // What you refer to is called "set semantics" of a collection, i.e. do not allow duplicates.
    var subsets= Immutable.Set().asMutable(); // needs to be immutable to avoid repetitions
    var subsetsgen = (subsetcardinality, subset) => {
      if (subsetcardinality > 0) {
        for (var j=0; j< aSet.length; j++) {
          if (!subset.contains(aSet[j])) {
            var newsubset = subset.slice().add(aSet[j]);
            subsets=subsets.add(newsubset);
            subsetsgen(subsetcardinality - 1, newsubset);
          }
        }
      }
    };
    subsetsgen(cardinality, base);
    subsets=subsets.add(base);
    return subsets;
  };

}


class SubsetGenerator {

  /**
   * A subset generator produces a set of subsets from a given set of elements.
   *
   * @param strategy
   */
  constructor(strategy = SubsetGenerationStrategies.bruteForce){
     this.strategy = strategy;
  }

  // BD: Please complete description of this interface.
  /**
   *
   * @param sourceSet
   * @param cardinality
   * @param base  The items in base are included in any subset produced. The size of base must be smaller than
   * the specified cardinality
   * @returns {*}
   */
  build(sourceSet, cardinality, base) {
    return this.strategy(sourceSet, cardinality, base);
  }


}





