import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from 'env-var';
import { logger } from '../../config/logger.js';

const nameHomeController = "HomeController: ";

config();

const JWT_SECRET = env.get("JWT_SECRET").required().asString();

class HomeController {
    static index(req, res) {
        try {
            const token = req.cookies.token || "";
            const title = "Raiz Finaciera";
            let role = "";

            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    role = decoded.role;
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameHomeController + "INDEX_NEUTRO: Rol del usuario decodificado:", role);
                    }
                } catch (err) {
                    logger.error(nameHomeController + "Token inválido o expirado:", err.message);
                }
            }
            if (process.env.NODE_ENV !== "production") {
                logger.info(nameHomeController + "INDEX_NEUTRO: Token del usuario:", token);
                logger.info(nameHomeController + "INDEX_NEUTRO VERIFICACION: Rol del usuario:", role);
            }
            return res.status(200).render('index', { token, title, role });
        } catch (error) {
            logger.error(nameHomeController + "Error en Home:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }

    static index_neutro(req, res) {
        try {
            const token = req.cookies.token || "";
            const title = "Raiz Finaciera";
            let role = "";

            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    role = decoded.role;
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameHomeController + "INDEX_NEUTRO: Rol del usuario decodificado:", role);
                    }
                } catch (err) {
                    logger.error(nameHomeController + "Token inválido o expirado:", err.message);
                }
            }
            if (process.env.NODE_ENV !== "production") {
                logger.info(nameHomeController + "INDEX_NEUTRO: Token del usuario:", token);
                logger.info(nameHomeController + "INDEX_NEUTRO VERIFICACION: Rol del usuario:", role);
            }
            return res.status(200).render("index", { token, title, role })
        } catch (error) {
            logger.error(nameHomeController + "Error en Home:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }

    static index_grupo(req, res) {
        try {
            const token = req.cookies.token || "";
            let role = "";

            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    role = decoded.role;
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameHomeController + "INDEX_GRUPO: Rol del usuario decodificado:", role);
                    }
                } catch (err) {
                    logger.error(nameHomeController + "Token inválido o expirado:", err.message);
                }
            }

            const titulo = "Integrantes del Grupo";
            const integrantes = [
                { nombre: "Jocelyn Rivera", carrera: "Estudiante Tec. Programación Computacional", foto: "./images/grupo/jocelyn_rivera.jpg", descripcion: "Desarrolladora Frontend" },
                { nombre: "Lisette Godoy", carrera: "Estudiante Tec. Programación Computacional", foto: "./images/grupo/lisette_godoy.jpg", descripcion: "Desarrolladora Frontend" },
                { nombre: "Maximiliano Caniullan", carrera: "Estudiante Tec. Programación Computacional", foto: "./images/grupo/maximiliano_caniullan.jpg", descripcion: "Desarrolladora Frontend" },
                { nombre: "Ramiro Fonseca", carrera: "Estudiante Tec. Programación Computacional", foto: "./images/grupo/ramiro_fonseca.jpg", descripcion: "Desarrolladora Frontend" }
            ];

            return res.render("grupo", {
                token,
                role,
                titulo,
                integrantes
            })

        } catch (error) {
            logger.error(nameHomeController + "Error en Home:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }
}

export default HomeController;