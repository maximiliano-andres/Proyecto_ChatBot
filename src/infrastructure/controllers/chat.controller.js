import axios from "axios";
import { config } from "../../config/env.js";
import { ChatMessage, validateChatMessage } from "../../domain/models/ChatMessage.js";
import { User } from "../../domain/models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import env from "env-var";
import debug from "debug";

const DEBUG = debug("app: CHAT:CONTROLLER:JS : ")

dotenv.config();

const WIT_AI_TOKEN = env.get("WIT_TOKEN").required().asString();

DEBUG(WIT_AI_TOKEN)

export class ChatController {
    static async handleMessage(req, res) {
        try {
            
            //DEBUG("cuerpo chat handleMessage: " + req.body)

            // Verificar si el token está presente en las cookies
            const token = req.cookies.token;
            
            //DEBUG("TOKEN: "+ token);
            
            if (!token) {
                DEBUG("No se ha encontrado el token en las cookies");
                return res.status(400).render("error404");
            }

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            //DEBUG("userId: "+ userId);

            if (!userId) {
                DEBUG("User ID no disponible en el token")
                return res.status(400).render("error404");
            }

            const { message } = req.body;

            
            DEBUG("MENSAJE: " + message);

            if (!message) {
                DEBUG("Mensaje es requerido");
                return res.status(400).render("error404");
            }

            // Validar existencia del usuario
            const user = await User.findById(userId);
            if (!user) {
                DEBUG("Usuario No encontrado")
                return res.status(400).render("error404");

            }

            // Llamar a Wit.ai para analizar el mensaje
            const response = await axios.get(`https://api.wit.ai/message?v=20230320&q=${encodeURIComponent(message)}`, {
                headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` }
            });

            //console.log("Respuesta completa de Wit.ai:", JSON.stringify(response.data, null, 2));

            let intent = "unknown";

            intent = response.data.intents?.[0]?.name || "unknown";
            DEBUG("INTENT RECIBIDO: ", intent);

            const entities = response.data.entities || {};
            //console.log("Entidades detectadas:", JSON.stringify(entities, null, 2));
            
            //DEBUG(entities);
            // Responder según la intención detectada
            let reply;
            switch (intent) {
                case "saludo":
                    reply = "Hola! ¿En qué puedo ayudarte hoy?";
                    break;
                case "consulta_producto":
                    reply = "Claro, ¿qué producto financiero te interesa?";
                    break;
                case "proceso_venta":
                    reply = "Voy a guiarte en el proceso de compra. Primero, ¿estás registrado?";
                    break;
                default:
                    reply = "Lo siento, no entiendo tu consulta. ¿Podrías reformularla?";
            }

            
            // Validar y guardar en MongoDB
            const { error } = validateChatMessage({ userId, message, response: reply });
            if (error) return res.status(400).json({ error: error.details[0].message });

            await ChatMessage.create({ userId, message, response: reply });

            // Limpiar la intención después de usarla
            intent = "unknown";
            DEBUG("INTENT CLEAR: ", intent);
            DEBUG("CHAT FUNCIONa AL 100%");

            return res.json({ reply });

        } catch (error) {
            console.error("Error en Wit.ai:", error);
            DEBUG("ERROR EN CHATCONTROLLER:JS")
            return res.status(500).render("error500");
        }
    }
}
