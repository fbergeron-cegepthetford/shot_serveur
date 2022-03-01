const Config = require("../configuration")

class Auth {
    /**
     * Lorsqu'on doit simplement être connecté (ie on a une clé api valide)
     * @param req
     * @param res
     * @param next
     */
    static api(req, res, next) {
        const tokenApi = req.headers["shot-key-api"];
        const tokenAdmin = req.headers['shot-key-admin'];
        if((tokenAdmin && tokenAdmin === Config.superSecreteAdminApiCle) || (tokenApi && tokenApi === Config.superSecreteAndroidApiCle)){
            next();
        }else {
            res.status(401).json({
                error: "Clé API invalide"
            });
        }
    }

    /**
     * Lorsque seulement un administrateur doit pouvoir le faire
     * @param req
     * @param res
     * @param next
     */
    static admin(req, res, next) {
        const token = req.headers['shot-key-admin'];

        if(token && token === Config.superSecreteAdminApiCle){
            next();
        }else {
            res.status(401).json({
                error: "Clé API Admin invalide"
            });
        }
    }
}

module.exports = Auth;
