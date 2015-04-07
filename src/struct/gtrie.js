import Immutable from 'immutable';

/**
 *  This graph like data structure can be used to predict the next input values based on the inputs
 *  already seen. Prediction is made by recording the sequences of values entered by clients
 *  to keep track of their overall distribution. Each input value is treated as the successor of all
 *  preceding inputs coming from the same sequence (= same client).
 *
 *  A sequence is an ordered collection of inputs ŕecorded in the same order as they occurred. Each node
 *  in the structure is a associated with exactly one distinct set of values. A node can have multiple
 *  outgoing and incoming edges. More precisely: A node may have as many
 *   a.) outgoing edges as there are distinct supersets with a cardinal value of +1 of the nodes value
 *   b.) incoming edges as there are distinct subsets with a cardinal value of -1 of the nodes value
 *
 *  Each node has a counter representing the number of visits made to that node. Each edge has a counter
 *  used to count the number of traverses.
 */
export class GTrie {

  constructor () {
    // Maps node values to their nodes
    this.valueToNode = Immutable.Map();
    var factory = ( value ) => {
      if ( this.valueToNode.has( value ) ) {
        return this.valueToNode.get( value );
      } else {
        var node = new Node( value, factory );
        this.valueToNode = this.valueToNode.set( value, node );
        return node;
      }
    };
    // The root node contains the empty set and is the entry point for tree operations
    this.root = new Node( Immutable.Set(), factory );
  }

  sequencecount () {
    return this.root.counter;
  }

  sequence () {
    return new Sequence( this.root );
  }
}

class Node {

  constructor ( val = Immutable.Set(), factory = ( value ) => new Node( value ) ) {
    this.out = Immutable.Map(); // projection from any => Link
    this.val = val;
    this.counter = 1;
    this.getNode = factory;
  }

  next ( input ) {
    this.counter++; // record this visit
    if ( this.out.has( input ) ) {
      // input has already been seen on this node
      // thus there is a link to the target node with the value {val,input}
      return this.out.get( input ).targets();
    }
    else {
      // input is new in this branch
      let newValue = this.val.add( input );

      // the node might have been created in another path (a permutation of the input values)
      var node = this.getNode( newValue );

      this.out = this.out.set( input, new Link( this, node ) );
      return node;
    }
  }

  /**
   * Compute a set of expected upcoming input values (prediction) based on the recorded weights of the outgoing edges of this node.
   *
   * @param threshold The lower bound which needs to be surpassed by an input value to be considered as a rasonabel prediction
   * @returns {Predictions} An ordered collection of predictions whose values exceeds the given threshold
   */
  predict ( threshold = 1 / 2 ) {
    var nodevisited = this.counter;
    var candidates = this.out
      .map( ( link, input ) => {
        return {
          prediction : input,
          score : link.counter / nodevisited}
      } )
      .filter( x => x.score >= threshold )
      .sort( ( valueA, valueB ) =>  valueA - valueB )
      .toArray();

    var prediction = new Predictions( candidates );
    return prediction;
  }


}

/**
 *
 */
class Predictions {

  constructor ( candidates, defaultValue = { prediction : 'no prediction', score : 0 }) {
    this.defaultValue = defaultValue;
    this.candidates = candidates;
  }

  getprediction ( k ) {
    return (this.candidates[k] !== undefined) ? this.candidates[k] : this.defaultValue;
  }

}


class Link {

  constructor ( source, target ) {
    this.source = source;
    this.target = target;
    this.counter = 1;
  }

  targets () {
    this.counter++;
    return this.target;
  }

}


/**
 *  A sequence represents an ordered set of inputs.
 */
class Sequence {

  constructor ( root ) {
    this.inputs = [];
    this.node = root;
  }

  allInputs () {
    return this.inputs;
  }

  input ( input ) {
    this.inputs.push( input ); // record this input
    this.node = this.node.next( input );
    return this;
  }

  prediction () {
    return this.node.predict();
  }
}

