import { User } from "../../domain/models/User.js";
import { Contratos } from "../../domain/models/Contrato.js";
import { config } from "dotenv";
import env from "env-var";
import jwt from 'jsonwebtoken';
import debug from "debug";

import { generarFirmaCliente, generarContratoPDF , generarDatosTarjeta} from "../controllers/GenerarDoc.controller.js";
import { render } from "ejs";


const DEBUG = debug("app: PDF_CONTROLLERS: ");
config();

export default class Contrato {
    static async crear_contrato(req,res){
        try {
            const token = req.cookies.token;
            DEBUG(`TOKEN: ${token}`);

            if (!token) return res.status(400).render("error404", { title: "Error 404" });

            const decorador = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decorador.id;
            DEBUG(`ID USUARIO: ${userId}`);

            const user_data = await User.findById(userId);
            DEBUG(`DATOS USUARIO: ${user_data}`);
            if (!user_data) return res.status(400).render("error404",{ title: "Error 404" });
            
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
                numero_documento: user_data.numero_documento
            };

            DEBUG("============== DATOS FICTICIOS ==============");
            DEBUG(datos);
            const logo_banco = "./public/img/Logo_Cuadro.png"

            //Firma_Validadora();
            //generarFirmaBanco();
            generarFirmaCliente(datos);
            const Obtener_firma = generarContratoPDF(datos, logo_banco);

            const datos_tarjeta = generarDatosTarjeta();

            DEBUG("============== DATOS TARJETA FICTICIA==============");
            DEBUG(`ID USUARIO: ${userId}`);
            DEBUG(Obtener_firma.codigo_verificador);
            DEBUG(datos_tarjeta);

            const guardar_contrato = new Contratos ({
                user:userId,
                codigo_verificador:Obtener_firma.codigo_verificador,
                numero_tarjeta: datos_tarjeta.numero_tarjeta,
                fecha_expiracion: datos_tarjeta.fecha_expiracion,
                cvv: datos_tarjeta.cvv,
                limite_credito: datos_tarjeta.limite_credito,
                saldo_disponible: datos_tarjeta.saldo_disponible,
                estado: datos_tarjeta.estado,
                fecha_emision: datos_tarjeta.fecha_emision,
            });

            DEBUG("=============== DATOS DE CONTRATO ===============");
            DEBUG(guardar_contrato);

            const vista_pdf = Obtener_firma.rutaPDF;


            DEBUG(vista_pdf);
            //../../PDF/contrato_123.456.789.pdf

            await guardar_contrato.save();

            DEBUG("GUARDADO CON EXITO!!!!!");

            return res.status(200).render("PDF", {vista_pdf})

        } catch (error) {
            console.error("Error en Registro:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    };


};