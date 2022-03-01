const fs = require('fs');

const Citation = require('../data/Citation');
const path = require('path');

/**
 * Charge les citations depuis le fichier
 * @param fichier Chemin complet vers un fichier, optionnel
 */

class CollectionCitation {
    constructor() {
        this.liste_citations = [];
        this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/depot/citations.json');
    }

    chargerCitation(fichier) {
        try {
            this.liste_citations.length = 0;

            const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
            console.log(`Chargement des citations depuis ${chemin}`);

            fs.readFile(chemin, { flag: 'r' }, (err, data) => {
                if (err && err.errno === -4058) {
                    console.log('Le fichier n\'existe pas, la liste des citations sera vide');
                } else if (data.length > 0) {
                    const liste = JSON.parse(data);
                    for (const citation of liste) {
                        this.liste_citations.push(new Citation(citation.id, citation.auteur, citation.citation, citation.annee));
                    }
                }
            });
        } catch (err) {
            console.log('Erreur dans le chargement des citations');
        }
    }

    /**
     * Fonction interne pour trouver le prochain ID pour une nouvelle citation. Si la liste de citations est vide l'id est zéro,
     * sinon c'est le dernier +1
     * @returns {number} prochain ID à utiliser
     */
    recupereProchainID() {
        let id = 0;
        if (this.liste_citations.length > 0) {
            id = this.liste_citations.slice(-1)[0].id;
            id += 1;
        }
        return id;
    }

    /**
     * Retourne les citations
     * @param id Optionnel, pour avoir une seule citation au lieu de toute la liste
     * @returns {*[]|*}
     */
    recupereCitation(id) {
        if (id > -1) {
            return this.liste_citations.find(x => x.id === id);
        } else {
            return this.liste_citations;
        }
    }

    /**
     * Fonction interne. Sauvegarde les fichiers sur le disque
     * @param fichier Optionnel chemin vers un fichier de sauvegarde
     */
    sauvegarder(fichier) {
        const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
        const data = JSON.stringify(this.liste_citations, null, 4);
        try {
            fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Citations enregistrés dans le fichier ${chemin}`);
            });
        } catch (err) {
            console.log('Erreur dans l\'enregistrement du fichier');
            console.log(err.message);
        }
    }

    /**
     * Ajoute une citation
     * @param citation instance de la classe citation
     */
    ajouterCitation(citation) {
        if (citation.id === -1) {
            citation.id = this.recupereProchainID();
        }
        this.liste_citations.push(citation);
        this.sauvegarder();
    }

    /**
     * Efface une citation
     * @param fait instance de citation
     */
    effacerCitation(fait) {
        this.liste_citations.splice(this.liste_citations.findIndex(item => item.id === fait.id), 1);
        this.sauvegarder();
    }

    taille(){
        return this.liste_citations.length;
    }
}

module.exports = CollectionCitation;
