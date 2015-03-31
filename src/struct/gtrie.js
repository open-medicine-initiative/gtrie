import Immutable from 'immutable';

/**
 *
 */
export class GTrie {

  constructor () {
    this.roots = Immutable.Map();
    this.allValues = Immutable.Map(); // Immutable.Maps sets to their nodes
  }

  nodeFor(value){
    return this.allValues.get(value);
  }

  sequence ( start ) {
    // a new sequence starts at a known root


    // or defines a new one


    return new Sequence();
  }
}

class Node {

  constructor (tree, val) {
    this.out = Immutable.Map();
    this.val = val;
    this.counter = 1;
    this.tree = tree;
  }

  next ( input ) {
    this.counter++; // record this visit
    if ( this.out.has( input ) ) {
      // input has already been seen on this node
      // thus there is a link to the target node with the value {val,input}
      return this.out.get(input).target();
    }
    else{
      // input is new in this branch
      let newValue = val.add(input);

      // the node might have been created in another path (a permutation of the input values)
      var node = this.tree.nodeFor(newValue);
      if (!node){
        // or it is entirely new to the tree
        node = new Node(this.tree, newValue);
      }
      this.out.set(input)


    }
  }


}

class Link {

  constructor (source, target) {
    this.source = source;
    this.target = target;
    this.counter = 1;
  }

  target(){
    this.counter++;
    return this.target;
  }

}


/**
 *  A sequence represents an ordered set of inputs.
 */
class Sequence {

  constructor ( ) {
    this.values = new Set();
    this.node = undefined;
  }

  asSet(){
    return this.values;
  }

  next ( input ) {
    // adding another value will increment all counters
    // on the path
    this.node = this.node.next(input);
    this.values = this.values.add(input);
    return this;
  }

}

