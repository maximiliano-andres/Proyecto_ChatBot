import axios from "axios";
import { config } from "../../config/env.js";
import { ChatMessage, validateChatMessage } from "../../domain/models/ChatMessage.js";
import { User } from "../../domain/models/User.js";

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
            DEBUG("cuerpo chat handleMessage: ")
            DEBUG(req.body)


            const { userId, message } = req.body;

            DEBUG(userId);
            DEBUG(message);

            if (!message || !userId) {
                console.log("Mensaje y userId son requeridos");
                return res.status(400).json({ error: "Mensaje y userId son requeridos" });
            }
            

            // Validar existencia del usuario
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            // Llamar a Wit.ai para analizar el mensaje
            const response = await axios.get(`https://api.wit.ai/message?v=20230320&q=${encodeURIComponent(message)}`, {
                headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` }
            });

            const intent = response.data.entities?.intent?.[0]?.value || "unknown";

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

            return res.json({ reply });
        } catch (error) {
            console.error("Error en Wit.ai:", error);
            return res.status(500).json({ error: "Error procesando la solicitud" });
        };
    };
};