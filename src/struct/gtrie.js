import Immutable from 'immutable';

/**
 *
 */
export class GTrie {

  constructor () {
    this.allValues = Immutable.Map(); // Immutable.Maps sets to their nodes
    this.root = new Node(this);
  }

  nodeFor(value){
    if(this.allValues.has(value)){
      return this.allValues.get(value);
    }else {
      var node = new Node(this, value);
      this.allValues = this.allValues.set(value, node);
      return node;
    }
  }

  sequencecount (){
    return this.root.counter;
  }

  sequence ( ) {
     return new Sequence(this.root, this);
  }
}

class Node {

  constructor (tree, val = Immutable.Set()) {
    this.out = Immutable.Map(); // projection from any => Link
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

      this.out = this.out.set(input, new Link(this, node));
      return node;

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

  constructor ( root , tree) {
    this.inputs = [];
    this.node = root;
    this.owner = tree;
  }

  allInputs(){
    return this.inputs;
  }

  input ( input ) {
    this.inputs.push(input); // record this input
    this.node = this.node.next(owner, input);
    return this;
  }

}

