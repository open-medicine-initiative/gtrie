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
    });
  });
})();
