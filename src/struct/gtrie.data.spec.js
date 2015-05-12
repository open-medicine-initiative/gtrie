import {GTrie} from 'gtrie';
import {data} from '../data/disease-symptom';

(function () {
  'use strict';
  describe('GTries construction', () => {

    describe('the empty tree', () => {

      describe('is done by consuming sequences of input values', () => {
        it('Empty sequences are constructed with sequence()', () => {
          var testTrie = new GTrie();
          var seq = testTrie.sequence();
          expect(seq).not.to.be.null;
          expect(seq.allInputs()).to.be.empty;
        });
      });
    });

    describe('input of sample data to the tree', () => {

      describe('UserEmulator.userEntry works', () => {
        it('single entry of "Abscessed tooth" yields the expected input pattern', () => {
          var testTrie = new GTrie();
          var seq = new UserEmulator(testTrie).userEntry("Abscessed Tooth");
          expect(seq.inputs.length).to.equal(9);
          expect(seq.inputs[0]).to.equal("Fever");
          expect(seq.inputs[8]).to.equal("An open, draining sore on the side of the gum");
        });
      });

      describe('UserEmulator.multipleUsers works', () => {
        it('a simple sample dataset yields the expected input pattern', () => {
          var testTrie = new GTrie();
          var Emulator = new UserEmulator(testTrie);
          var population = {
            "type one": {times: 1, disease: "Abscessed Tooth"},
            "type two": {times: 1, disease: "Aganglionic Megacolon"}
          };
          Emulator.multipleUsers(population);
          expect(testTrie.sequencecount()).to.equal(2);
        });
      });
    });

    describe('Prediction using sample dataset', () => {
      describe('Simple predictions', () => {
        it('The tree predicts missing symptoms in a simple population', () => {
          var population = {
            "type one": {times: 1, disease: "Abscessed Tooth"},
            "type two": {times: 1, disease: "Aganglionic Megacolon"}
          };

          var testTrie = new GTrie();
          new UserEmulator(testTrie).multipleUsers(population);
          var seq = testTrie.sequence().input("Fever");
          expect(seq.predict().input).to.equal("Pain when chewing");
          seq.input("Sensitivity of the teeth to hot or cold");
          expect(seq.predict().input).to.equal("Pain when chewing");
          seq.input("Pain when chewing");
          expect(seq.predict().input).to.equal("Bitter taste in the mouth");
        });
      });

      describe('Predictions in diverse population', () => {

        it('Symptom shared by many diseases leads to predcition of symptoms from disease with highest relative frequency', () => {

          var population = {
            "type one": {times: 3, disease: "Aganglionic Megacolon"},
            "type two": {times: 2, disease: "Bladder Infections in Children"},
            "type three": {times: 2, disease: "Necrotizing Enterocolitis"},
            "type four": {times: 2, disease: "Small bowel obstruction"}
          };

          var testTrie = new GTrie();
          new UserEmulator(testTrie).multipleUsers(population);
          var seq = testTrie.sequence().input("Vomiting.");

          console.log(seq.predict().score);

          expect(data["Aganglionic Megacolon"]["symptoms"].indexOf(seq.predict().input)).not.to.equal(-1);
        });
      });


    });
  });
})();


class UserEmulator {

  constructor(testTrie) {
    this.data = data;
    this.tree = testTrie;
  }

  userEntry(disease) {
    var seq = this.tree.sequence();
    for (var symptom of this.data[disease].symptoms) {
      seq = seq.input(symptom);
    }
    return seq;
  }

  multipleUsers(population) {
    for (var type in population) {
      if (population.hasOwnProperty(type)) {
        for (var i = 0; i < population[type].times; i++) {
          this.userEntry(population[type].disease);
        }
      }
    }

  }

}


