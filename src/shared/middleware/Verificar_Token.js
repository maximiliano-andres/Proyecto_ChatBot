import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from 'env-var';
import debug from 'debug';

const DEBUG = debug('app: VERIFICACION TOKEN MIDDLEWARE:');
config();

const JWT_SECRET = env.get("JWT_SECRET").required().asString();

DEBUG("HOLA")

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    const cokk = req.cookies;
    DEBUG("COOKIES recibido:", cokk);
    // Mostrar el token recibido
    DEBUG("Token recibido:", token);

    if (!token) {
        DEBUG("NO HAY TOKEN");
        return res.status(401).render("login", { title: "Login", error: "Debe iniciar sesión para acceder" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            DEBUG("Error de verificación del token:", err);
            return res.status(401).render("login", { title: "Login", error: "Sesión expirada, debe volver a iniciar sesión" });
        }

        // Mostrar los datos decodificados del token
        DEBUG("Token verificado, datos del usuario:", decoded);

        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next();
    });
};
