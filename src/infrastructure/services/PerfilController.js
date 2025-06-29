import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from 'env-var';
import { User } from '../../domain/models/User.js';
import { logger } from '../../config/logger.js';

const namePerfilController = "PerfilController: ";
const JWT_SECRET = env.get("JWT_SECRET").asString();

config();
export default class Perfil {

    static async perfil(req, res) {
        try {

            const token = req.cookies.token || "";

            const title = "Perfil de Usuario"

            let role = "";

            let email = "";

            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    role = decoded.role;
                    email = decoded.email;
                    
                    logger.info(namePerfilController + "Rol del usuario decodificado:", role);
                    logger.info(namePerfilController + "ID del usuario decodificado:", email);
                    logger.info(namePerfilController + "ID del usuario decodificado:", decoded.email);
                } catch (err) {
                    console.error("Token inválido o expirado:", err.message);
                }
            }
            logger.info(namePerfilController + "Token del usuario:", token);
            logger.info(namePerfilController + "Rol del usuario:", role);

            const usuario = await User.find({email});
            if (!usuario) {
                return res.status(404).render("error404", {
                    title: "Error 404",
                    error: "Usuario no encontrado"
                });
            }

            logger.info(namePerfilController + usuario);
            
            logger.info(namePerfilController + "TODO SALIO BIEN EN PERFIL");

            return res.status(200).render("perfil",
                {
                    title, error: "", usuario, role, token,
                })


        } catch (error) {
            logger.error("Error en perfil:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    };
}