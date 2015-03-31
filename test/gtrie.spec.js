import {GTrie} from 'gtrie';

(function () {
  'use strict';
  describe('GTries construction', () => {
    var testTrie = new GTrie();
    describe('is done by consuming sequences of input values', () => {
      it('Sequences are constructed with sequence()', () => {
        var seq = testTrie.sequence();
        expect(seq).not.to.be.null;
        expect(seq.allInputs()).to.be.empty;

      });
      it('Sequences remember their input', () => {
        var seq = testTrie.sequence();
        expect(seq.allInputs()).to.be.empty;
        seq.input('one');
        expect(seq.allInputs()).to.have.length(1);
        expect(seq.allInputs()).to.have.length(1);
        expect(testTrie.sequencecount()).to.equal(1);

      });
    });
  });
})();
