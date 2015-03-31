import {GTrie} from 'gtrie';

(function () {
  'use strict';
  describe('GTries construction', () => {
    var testTrie = new GTrie();
    describe('is done by consuming sequences of input values', () => {
      it('Sequences are constructed with sequence()', () => {
        var seq = testTrie.sequence();
        expect(seq).not.to.be.null;
      });
    });
  });
})();
