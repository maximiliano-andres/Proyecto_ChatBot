import axios from "axios";
import { config } from "../../config/env.js";
import { ChatMessage, validateChatMessage } from "../../domain/models/ChatMessage.js";
import { User } from "../../domain/models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import env from "env-var";
import debug from "debug";

import { intentResponses } from "../../shared/utils/mensajes.js";
import { intentFollowUp } from "../../shared/utils/mensajes.js";
import { requisitosDetails } from "../../shared/utils/mensajes.js";


const DEBUG = debug("app: CHAT:CONTROLLER:JS : ");
dotenv.config();

const WIT_AI_TOKEN = env.get("WIT_TOKEN").required().asString();

export class ChatController {
    static conversationState = {};

    static async handleMessage(req, res) {
        try {
            DEBUG("================== MENSAJE NUEVO ==================");

            const token = req.cookies.token;
            if (!token) return res.status(400).render("error404", { title: "Error 404" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const { message } = req.body;
            if (!message) return res.status(400).render("error404", { title: "Error 404" });

            const userState = ChatController.conversationState[userId] || {};
            DEBUG("========== USER STATE ==========");
            DEBUG(userState);
            DEBUG("================================");
            if (!userState.awaitingRequisitos) {
                userState.awaitingRequisitos = false;
            }

            // Si el usuario está esperando los requisitos
            if (userState.awaitingRequisitos) {
                DEBUG("========== userState.intent ==========");
                DEBUG(userState.intent);  // Verificamos el intent

                const intentKey = userState.intent;  // Extrae la parte relevante del intent (ej. "oro")
                DEBUG("========== intentKey ==========");
                DEBUG(intentKey);
                DEBUG("========== MENSAJE REQUISITOS ==========");
                
                DEBUG( message );

                const requisitos = requisitosDetails[`${intentKey}`];
                const otro_mensaje = "OK, en que más te puedo ayudar";

                if (message.toLowerCase().includes("si")) {
                    // Mantener awaitingRequisitos en false para no repetir la respuesta
                    ChatController.conversationState[userId] = {
                        intent: userState.intent,
                        awaitingRequisitos: false
                    };
                    DEBUG("========== requisitos ==========");
                    DEBUG(requisitos);

                    return res.json({ reply: requisitos });
                };

                ChatController.conversationState[userId] = {}
                return res.json({ reply: otro_mensaje});

                
            }

            // Si el usuario está esperando una respuesta
            if (userState.awaitingResponse && userState.intent) {
                const followUp = intentFollowUp[userState.intent];
                const response = followUp[message.toLowerCase()] || "No entendí tu respuesta XD.";
                DEBUG("========== follow ==========");
                DEBUG(followUp);
                DEBUG("========== response ==========");
                DEBUG(response);

                if (message.toLowerCase() === "requisitos") {
                    // Establecer que el usuario está esperando los requisitos
                    const intentKey = userState.intent.split('_')[1];  // Extraer la parte relevante del intent
                    ChatController.conversationState[userId] = { intent: userState.intent, awaitingRequisitos: true };

                    DEBUG("========== MENSAJE ==========");
                    DEBUG(ChatController.conversationState[userId].intent);

                    DEBUG("FIN REQUISITOS");

                    return res.json({ reply: "Entendido, te detallo los requisitos." });
                }

                if (userState.intent === "consulta_tarjeta" || userState.intent === "consulta_seguro") {
                    const opcionSeleccionada = message.toLowerCase();
                    DEBUG("========== OPCION ==========");
                    DEBUG(opcionSeleccionada);

                    if (["clasica", "oro", "black", "vida", "salud", "auto"].includes(opcionSeleccionada)) {
                        // Actualizar el estado para saber que el usuario seleccionó una tarjeta o seguro
                        //const tipoConsulta = userState.intent.split('_')[1]; // Extrae "tarjeta" o "seguro"
                        ChatController.conversationState[userId] = { intent: `${opcionSeleccionada}`, awaitingRequisitos: true };
                        DEBUG("============== SELECCION TARJETA O SEGURO ==============");
                        DEBUG(ChatController.conversationState[userId].intent);
                        DEBUG("======================================================");
                    } else {
                        return res.json({ reply: "Opción no válida. Solo puedes elegir entre las opciones disponibles." });
                    }
                } else {
                    ChatController.conversationState[userId] = {};
                }

                return res.json({ reply: response });
            }

            // Llamada a Wit.ai para obtener la intención del usuario
            const response = await axios.get(`https://api.wit.ai/message?v=20230320&q=${encodeURIComponent(message)}`, { headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` } });

            DEBUG("========== response.data.intents ==========");
            DEBUG(response.data.intents);  // Ver qué datos devuelve Wit.ai

            let intent = response.data.intents?.[0]?.name || "unknown";  
            DEBUG("========== intent ==========");
            DEBUG(intent);

            const reply = intentResponses[intent] || intentResponses["unknown"];

            if (intentFollowUp[intent]) {
                ChatController.conversationState[userId] = { awaitingResponse: true, intent };
            }

            const { error } = validateChatMessage({ userId, message, response: reply });
            if (error) return res.status(400).json({ error: error.details[0].message });

            await ChatMessage.create({ userId, message, response: reply });

            return res.json({ reply });
        } catch (error) {
            DEBUG("ERROR EN CHATCONTROLLER:JS", error);
            return res.status(500).render("error500", { title: "Error 500" });
        }
    }
}
