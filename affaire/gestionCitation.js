const Citation = require('../data/Citation');

const Config = require('../configuration');

class GestionCitations {
    constructor(collectionCitation) {
        this.collectionCitation = collectionCitation;
    }

    /**
     * Efface une citation avec son ID. Irréversible.
     * @param req
     * @param res
     */
    effaceCitation(req, res) {
        const id = parseInt(req.params.id);
        const citation = this.collectionCitation.recupereCitation(id);
        if (!citation) {
            res.status(400).send(`La citation avec l'id ${id} n'a pas été trouvée`);
        } else {
            this.collectionCitation.effacerCitation(citation);
            res.status(200).send();
        }
    }

    /**
     * Ajoute une citation. Tous les champs doivent être là.
     * @param req
     * @param res
     */
    ajouteCitation(req, res) {
        const c = new Citation(-1, req.body.auteur, req.body.citation, req.body.annee);
        this.collectionCitation.ajouterCitation(c);
        res.send(JSON.stringify(c));
    }


    /**
     * Retourne une citation précise si un query param id existe, sinon c'est la citation du jour.
     * @param req
     * @param res
     */
    recupereCitation(req, res) {
        let id; // valeur neutre?

        // S'il y a des éléments dans query, alors c'est une recherche par id
        if (Object.keys(req.query).length > 0) {
            id = req.query.id;
        } else { // sinon c'est qu'on veut un fait aléatoire
            const nbCitations = this.collectionCitation.taille();
            const tempsZero = Config.timestampZero; //temps où le serveur a été créé
            const tempsCourant  = new Date().getTime(); // timestamp de la requete
            const diff = tempsCourant - tempsZero; //difference en milliseconde
            const nbJours = Math.floor(diff / (1000 * 3600 * 24)); //on divise par le nombre de secondes par jour
            id = nbJours % (nbCitations - 1); //si on arrive à la fin des ids on retourne au début et on boucle
        }
        res.send(this.collectionCitation.recupereCitation(id));
    }
}

module.exports = GestionCitations;
