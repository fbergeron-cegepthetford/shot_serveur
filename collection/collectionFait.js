const fs = require('fs');

const Fait = require('../data/Fait');
const path = require('path');

/**
 * Charge les faits depuis le fichier
 * @param fichier Chemin complet vers un fichier, optionnel
 */

class CollectionFait {
    constructor() {
        this.liste_faits = [];
        this.CHEMIN_PAR_DEFAUT = path.join(__dirname, '/../data/depot/faits.json');
    }

    chargerFait(fichier) {
        try {
            this.liste_faits.length = 0;

            const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
            console.log(`Chargement des faits depuis ${chemin}`);

            fs.readFile(chemin, { flag: 'r' }, (err, data) => {
                if (err && err.errno === -4058) {
                    console.log('Le fichier n\'existe pas, la liste des faits sera vide');
                } else if (data.length > 0) {
                    const liste = JSON.parse(data);
                    for (const fait of liste) {
                        this.liste_faits.push(new Fait(fait.id, fait.description));
                    }
                }
            });
        } catch (err) {
            console.log('Erreur dans le chargement des faits');
        }
    }

    /**
     * Fonction interne pour trouver le prochain ID pour un nouveau fait. Si la liste de faits est vide l'id est zéro,
     * sinon c'est le dernier +1
     * @returns {number} prochain ID à utiliser
     */
    recupereProchainID() {
        let id = 0;
        if (this.liste_faits.length > 0) {
            id = this.liste_faits.slice(-1)[0].id;
            id += 1;
        }
        return id;
    }

    /**
     * Retourne les faits
     * @param id Optionnel, pour avoir un seul fait au lieu de toute la liste
     * @returns {*[]|*}
     */
    recupereFait(id) {
        if (id > -1) {
            return this.liste_faits.find(x => x.id === id);
        } else {
            return this.liste_faits;
        }
    }

    /**
     * Fonction interne. Sauvegarde les fichiers sur le disque
     * @param fichier Optionnel chemin vers un fichier de sauvegarde
     */
    sauvegarder(fichier) {
        const chemin = fichier || this.CHEMIN_PAR_DEFAUT;
        const data = JSON.stringify(this.liste_faits, null, 4);
        try {
            fs.writeFile(chemin, data, { flag: 'w+' }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Faits enregistrés dans le fichier ${chemin}`);
            });
        } catch (err) {
            console.log('Erreur dans l\'enregistrement du fichier');
            console.log(err.message);
        }
    }

    /**
     * Ajoute un fait
     * @param fait instance de la classe fait
     */
    ajouterFait(fait) {
        if (fait.id === -1) {
            fait.id = this.recupereProchainID();
        }
        this.liste_faits.push(fait);
        this.sauvegarder();
    }

    /**
     * Efface un fait
     * @param fait instance de fait
     */
    effacerFait(fait) {
        this.liste_faits.splice(this.liste_faits.findIndex(item => item.id === fait.id), 1);
        this.sauvegarder();
    }

    taille(){
        return this.liste_faits.length;
    }
}

module.exports = CollectionFait;
