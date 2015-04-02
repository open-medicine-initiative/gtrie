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
        //expect(seq.allInputs()).to.have.length(1);
        //expect(testTrie.sequencecount()).to.equal(1);

      });

      it('Sequences remember their input', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two').input('three');
        expect(seq.allInputs()).to.have.length(3);
      });

      it('Sequences predict next input', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two').input('three');
        var seq2 = testTrie.sequence().input('one');
        //expect(seq2.prediction().getprediction(0).prediction).not.to.be.null;
        expect(seq2.prediction().getprediction(1).prediction).to.equal('no prediction');
        expect(seq2.prediction().getprediction(0).prediction).to.equal('two');
        //seq2.input('two');
        //expect(seq2.prediction().get(0)[0]).to.equal('three');
      });
      it('Prediction matches expectation', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one').input('two');
        var seq2 = testTrie.sequence().input('one').input('two');
        var seq3 = testTrie.sequence().input('one').input('two');
        var seq4 = testTrie.sequence().input('one').input('two');
        var seq5 = testTrie.sequence().input('one').input('three');
        var seq6 = testTrie.sequence().input('one');;
        expect(seq6.prediction().getprediction(0).prediction).to.equal('two');
        expect(seq6.prediction().getprediction(0).relativeFrequency).to.equal(2/3);
      });
      it('Prediction matches expectation', () => {
        var testTrie = new GTrie();
        var seq = testTrie.sequence().input('one');
        expect(seq.prediction().getprediction(0).prediction).to.equal('no prediction');
      });

    });
  });
})();
