
const GestionCitation = require('../affaire/gestionCitation');
const GestionFait = require('../affaire/gestionFait');

const CollectionFait = require('../collection/collectionFait');
const CollectionCitation = require('../collection/collectionCitation');


const collectionFait = new CollectionFait();
collectionFait.chargerFait();

const collectionCitation = new CollectionCitation();
collectionCitation.chargerCitation();


const gestionnaires = {
    gCitation: new GestionCitation(collectionCitation),
    gFait: new GestionFait(collectionFait),
};

module.exports = gestionnaires;
