import { User } from "../../domain/models/User.js";
import { Contratos } from "../../domain/models/Contrato.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { logger } from "../../config/logger.js";


import { generarFirmaCliente, generarContratoPDF, generarDatosTarjeta } from "../controllers/GenerarDoc.controller.js";

const namePdfController = "PDF_CONTROLLERS: ";

config();

export default class Contrato {
    static async crear_contrato(req, res) {
        try {
            const token = req.cookies.token;
            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + `TOKEN: ${token}`);
            }

            if (!token)
                return res.status(400).render("error404", { title: "Error 404" });

            const { intent } = req.query;
            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + `INTENT : => ${intent}`);
            }

            const decorador = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decorador.id;
            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + `ID USUARIO: ${userId}`);
            }

            const user_data = await User.findById(userId);
            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + `DATOS USUARIO: ${user_data}`);
            }
            if (!user_data)
                return res.status(400).render("error404", { title: "Error 404" });

            const datos = {
                _id: user_data._id,
                email: user_data.email,
                nombre1: user_data.nombre1,
                nombre2: user_data.nombre2,
                apellido1: user_data.apellido1,
                apellido2: user_data.apellido2,
                rut: user_data.rut,
                role: user_data.role,
                telefono: user_data.telefono,
                numero_documento: user_data.numero_documento,
            };

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "============== DATOS FICTICIOS ==============");
                logger.info(namePdfController + datos);
            }
            const logo_banco = "./public/images/pdf/Logo_Cuadro.png";

            generarFirmaCliente(datos);
            const Obtener_firma = generarContratoPDF(datos, logo_banco);
            const datos_tarjeta = generarDatosTarjeta();

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "============== DATOS TARJETA FICTICIA==============");
                logger.info(namePdfController + `ID USUARIO: ${userId}`);
                logger.info(namePdfController + Obtener_firma.codigo_verificador);
                logger.info(namePdfController + datos_tarjeta);
            }

            const guardar_contrato = new Contratos({
                user: userId,
                codigo_verificador: Obtener_firma.codigo_verificador,
                numero_tarjeta: datos_tarjeta.numero_tarjeta,
                fecha_expiracion: datos_tarjeta.fecha_expiracion,
                cvv: datos_tarjeta.cvv,
                limite_credito: datos_tarjeta.limite_credito,
                saldo_disponible: datos_tarjeta.saldo_disponible,
                estado: datos_tarjeta.estado,
                fecha_emision: datos_tarjeta.fecha_emision,
            });

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "=============== DATOS DE CONTRATO ===============");
                logger.info(namePdfController + guardar_contrato);
                logger.info(namePdfController + Obtener_firma.nombre_contrato);
                logger.info(namePdfController + "Visualizacion Exitosa!!!!!");
                logger.info(namePdfController + "crear_contrato: Token del usuario:", token);
                logger.info(namePdfController + "crear_contrato: Rol del usuario:", user_data.role);
            }

            const vista_pdf = Obtener_firma.nombre_contrato;
            let role = user_data.role;

            return res.status(200).render("PDF", { vista_pdf, token, role });
        } catch (error) {
            logger.error(`Error en Crear Contrato: ${error}`);
            return res.status(500).render("error500", {
                title: "Error 500",
            });
        }
    }

    static async Firma_contrato(req, res) {
        try {
            const token = req.cookies.token;
            if (!token)
                return res.status(400).render("error404", { title: "Error 404" });

            const decorador = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decorador.id;

            const user_data = await User.findById(userId);
            if (!user_data)
                return res.status(400).render("error404", { title: "Error 404" });

            const datos = {
                _id: user_data._id,
                email: user_data.email,
                nombre1: user_data.nombre1,
                nombre2: user_data.nombre2,
                apellido1: user_data.apellido1,
                apellido2: user_data.apellido2,
                rut: user_data.rut,
                role: user_data.role,
                telefono: user_data.telefono,
                numero_documento: user_data.numero_documento,
            };

            const logo_banco = "./public/images/pdf/Logo_Cuadro.png";

            generarFirmaCliente(datos);
            const Obtener_firma = generarContratoPDF(datos, logo_banco);
            const datos_tarjeta = generarDatosTarjeta();

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "============== DATOS TARJETA FICTICIA==============");
                logger.info(namePdfController + `ID USUARIO: ${userId}`);
                logger.info(namePdfController + Obtener_firma.codigo_verificador);
                logger.info(namePdfController + datos_tarjeta);
            }

            const guardar_contrato = new Contratos({
                user: userId,
                codigo_verificador: Obtener_firma.codigo_verificador,
                numero_tarjeta: datos_tarjeta.numero_tarjeta,
                fecha_expiracion: datos_tarjeta.fecha_expiracion,
                cvv: datos_tarjeta.cvv,
                limite_credito: datos_tarjeta.limite_credito,
                saldo_disponible: datos_tarjeta.saldo_disponible,
                estado: datos_tarjeta.estado,
                fecha_emision: datos_tarjeta.fecha_emision,
            });

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "=============== DATOS DE CONTRATO EXITOSO ===============");
                logger.info(namePdfController + guardar_contrato);
                logger.info(namePdfController + Obtener_firma.rutaPDF);
            }

            await guardar_contrato.save();

            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + "GUARDADO CON EXITO!!!!!");
            }
            const { intent } = req.query;
            if (process.env.NODE_ENV !== "production") {
                logger.info(namePdfController + `INTENT : ${intent}`);
                logger.info(namePdfController + "Firma_contrato: Token del usuario:", token);
                logger.info(namePdfController + "Firma_contrato: Rol del usuario:", user_data.role);
            }

            let role = user_data.role;

            return res.render("index", {
                role,
                token: token,
                title: "Raíz Finanziera",
                titulo_1: "Bienvenido a Raíz Finanziera",
                subtitulo: "Seguridad, crecimiento y confianza en cada inversión.",
                titulo_NH: "Nuestra Historia",
                texto_NH1:
                    "En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes.",
            });
        } catch (error) {
            logger.error(`Error en Firmar Contrato: ${error}`);
            return res.status(500).render("error500", {
                title: "Error 500",
            });
        }
    }
}
