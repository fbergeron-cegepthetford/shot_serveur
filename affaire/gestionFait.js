const Fait = require('../data/Fait');

class GestionFaits {
    constructor(collectionFait) {
        this.collectionFait = collectionFait;
    }

    /**
     * Efface un fait avec son ID. Irréversible.
     * @param req
     * @param res
     */
    effaceFait(req, res) {
        const id = parseInt(req.params.id);
        const fait = this.collectionFait.recupereFait(id);
        if (!fait) {
            res.status(400).send(`Le fait avec l'id ${id} n'a pas été trouvé`);
        } else {
            this.collectionFait.effacerFait(fait);
            res.status(200).send();
        }
    }

    /**
     * Ajoute un fait. Tous les champs doivent être là.
     * @param req
     * @param res
     */
    ajouteFait(req, res) {
        const c = new Fait(-1, req.body.description);
        this.collectionFait.ajouterFait(c);
        res.send(JSON.stringify(c));
    }


    /**
     * Retourne un fait précis ou aléatoire selon la présence du query param id
     * @param req
     * @param res
     */
    recupereFait(req, res) {
        let id = -1; // valeur neutre?

        // S'il y a des éléments dans query, alors c'est une recherche par id
        if (Object.keys(req.query).length > 0) {
            id = req.query.id;
        } else { // sinon c'est qu'on veut un fait aléatoire
            const nbFaits = this.collectionFait.taille();
            id = Math.floor(Math.random() * nbFaits);
        }
        res.send(this.collectionFait.recupereFait(id));
    }

}

module.exports = GestionFaits;
