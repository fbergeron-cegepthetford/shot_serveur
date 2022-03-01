const express = require('express');
const { validate, Joi } = require('express-validation');
const auth = require('./../middleware/auth');
const router = express.Router();
const gCitation = require('../util/gestionnaires').gCitation;

const adresseIdValidation = {
  params: Joi.object({
    id: Joi.number().integer().required()
  })
};

const nouvelleCitationValidation = {
  body: Joi.object({
    auteur: Joi.string().required(),
    citation: Joi.string().required(),
    annee: Joi.number().integer().required()
  })
};

const rechercherCitationValidation = {
  query: Joi.object({
    id: Joi.number().integer()
  })
};

/**
 * Ajoute une nouvelle citation. S'utilise avec une requête de type POST.
 * Il faut passer dans le corps de la requête une description complète sous forme de JSON.
 */
router.post('/', validate(nouvelleCitationValidation), auth.admin, gCitation.ajouteCitation.bind(gCitation));

/**
 * Retourne une citation
 * La requête pour filtrer sera de la forme /cdj?&id=2143
 */
router.get('/', validate(rechercherCitationValidation, {}, {}), gCitation.recupereCitation.bind(gCitation));


/**
 * Efface une citation. Attention, c'est permanent!
 */
router.delete('/:id', validate(adresseIdValidation, {}, {}), auth.admin, gCitation.effaceCitation.bind(gCitation));

module.exports = router;
