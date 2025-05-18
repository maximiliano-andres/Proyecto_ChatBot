import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from 'env-var';
import debug from 'debug';
import { User } from '../../domain/models/User.js';

const DEBUG = debug('app: PerfilController');
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
                    
                    DEBUG(" Rol del usuario decodificado:", role);
                    DEBUG(" ID del usuario decodificado:", email);
                    DEBUG("ID del usuario decodificado:", decoded.email);
                } catch (err) {
                    console.error("Token inválido o expirado:", err.message);
                }
            }
            DEBUG(" Token del usuario:", token);
            DEBUG(" Rol del usuario:", role);

            const usuario = await User.find({email});
            if (!usuario) {
                return res.status(404).render("error404", {
                    title: "Error 404",
                    error: "Usuario no encontrado"
                });
            }

            DEBUG(usuario);
            
            DEBUG("TODO SALIO BIEN EN PERFIL");

            return res.status(200).render("perfil",
                {
                    title, error: "", usuario, role
                })


        } catch (error) {
            console.error("Error en perfil:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    };
}