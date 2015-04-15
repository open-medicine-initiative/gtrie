import {GTrie} from 'gtrie';

(function () {
  'use strict';
  describe('GTries construction', () => {

    describe('is done by consuming sequences of input values', () => {
     it('Empty sequences are constructed with sequence()', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence();
        expect(seq).not.to.be.null;
        expect(seq.allInputs()).to.be.empty;

      });
      it('Sequences remember their input', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence();
        expect(seq.allInputs()).to.be.empty;
        seq.input('one');
        expect(seq.allInputs()).to.have.length(1);
        expect(testTrie.sequencecount()).to.equal(1);
      });

         it('Sequences remember their input', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two').input('three');
        expect(seq.allInputs()).to.have.length(3);
      });

      it('Sequences generate subsets of their inputs', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two');
        var seq1 = testTrie.sequence().input('three').input("one");
        expect(seq1.numberofSubsets()).to.equal(1);
      });

      it('Sequences predict next input', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two').input('three');
        var seq1 = testTrie.sequence().input('one');
        expect(seq.predict().input).to.equal('no prediction');
        expect(seq1.predict().input).to.equal('two');
        seq1.input('two');
        expect(seq1.predict().input).to.equal('three');
      });
      it('Order of inputs does not affect prediction behavior', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two').input('three');
        var seq1 = testTrie.sequence().input('three').input("one");
        expect(seq1.predict().input).to.equal('two');
      });
       it('Prediction matches expectation', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two');
        var seq2 = testTrie.sequence().input('one').input('two');
        var seq3 = testTrie.sequence().input('one').input('two');
        var seq4 = testTrie.sequence().input('one').input('two');
        var seq5 = testTrie.sequence().input('one').input('three');
        var seq6 = testTrie.sequence().input('one');
        expect(seq6.predict().input).to.equal('two');
        expect(seq6.predict().score).to.equal(4/5);
      });
       it('If there is nothing to predict, prediction is "no prediction" ', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one');
        expect(seq.predict().input).to.equal('no prediction');
      });
    });
  });
})();
