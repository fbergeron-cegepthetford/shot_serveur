const express = require('express');
const { validate, Joi } = require('express-validation');
const auth = require('./../middleware/auth');
const router = express.Router();
const gFaits = require('../util/gestionnaires').gFait;

const adresseIdValidation = {
    params: Joi.object({
        id: Joi.number().integer().required()
    })
};

const nouveauFaitValidation = {
    body: Joi.object({
        description: Joi.string().required()
    })
};

const rechercherFaitValidation = {
    query: Joi.object({
        id: Joi.number().integer()
    })
};

/**
 * Ajoute un nouveau fait. S'utilise avec une requête de type POST.
 * Il faut passer dans le corps de la requête une description complète sous forme de JSON.
 */
router.post('/', validate(nouveauFaitValidation), auth.admin, gFaits.ajouteFait.bind(gFaits));

/**
 * Retourne une citation. Il faut avoir une apikey pour y accéder.
 * La requête pour filtrer sera de la forme /fait?&id=2143
 */
router.get('/', validate(rechercherFaitValidation, {}, {}), auth.api, gFaits.recupereFait.bind(gFaits));


/**
 * Efface un fait. Attention, c'est permanent!
 */
router.delete('/:id', validate(adresseIdValidation, {}, {}), auth.admin, gFaits.effaceFait.bind(gFaits));

module.exports = router;
