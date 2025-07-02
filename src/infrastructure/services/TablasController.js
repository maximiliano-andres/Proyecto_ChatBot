import { Contratos } from "../../domain/models/Contrato.js";
import { Loan } from "../../domain/models/Prestamos_Personales.js";
import { Insurance } from "../../domain/models/Seguros.js";
import { CreditCard } from "../../domain/models/TarjetasCredito.js";
import { User } from "../../domain/models/User.js";
import { config } from "dotenv";
import env from "env-var";
import jwt from 'jsonwebtoken';
import { logger } from "../../config/logger.js";

const nameTablasController = "VISTA_TABLAS: ";

config();

const JWT_SECRET = env.get("JWT_SECRET").required().asString();

class ViewsTables {
    static async verTablas(req, res) {
        try {
            const token = req.cookies.token || "";

            if (!token) {
                if (process.env.NODE_ENV !== "production") {
                    logger.info(nameTablasController + "VER_TABLAS: No se proporcionó token.");
                }
                return res.status(403).render("error403");
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const role = decoded.role;

            if (process.env.NODE_ENV !== "production") {
                logger.info(nameTablasController + "VER_TABLAS: Rol del usuario decodificado:", role);
            }

            if (role !== "admin") {
                if (process.env.NODE_ENV !== "production") {
                    logger.info(nameTablasController + "VER_TABLAS: Rol no autorizado:", role);
                }
                return res.status(403).render("error403");
            }

            const usuarios = await User.find();
            const contratos = await Contratos.find();
            const prestamos = await Loan.find();
            const seguros = await Insurance.find();
            const tarjetas = await CreditCard.find();

            return res.status(200).render("tablas", {
                title: "Tablas de Amortización",
                error: "",
                usuarios,
                contratos,
                prestamos,
                seguros,
                tarjetas
            });

        } catch (error) {
            logger.error(nameTablasController + `Error en Ver Tablas: ${error}`);
            return res.status(500).render("tablas", {
                title: "Tablas de Amortización",
                error: "Error al cargar los datos",
                usuarios: [],
                contratos: [],
                prestamos: [],
                seguros: [],
                tarjetas: []
            });
        }
    }
}


export default ViewsTables;