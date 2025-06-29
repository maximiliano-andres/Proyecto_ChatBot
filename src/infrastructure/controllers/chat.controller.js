import axios from "axios";
import { ChatMessage, validateChatMessage } from "../../domain/models/ChatMessage.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import env from "env-var";
import { intentResponses, intentFollowUp, requisitosDetails  } from "../../shared/utils/mensajes.js";
import { logger } from "../../config/logger.js";


const nameChatController = "CHAT:CONTROLLER: ";
dotenv.config();

const WIT_AI_TOKEN = env.get("WIT_TOKEN").required().asString();

export class ChatController {
    static conversationState = {};

    static async handleMessage(req, res) {
        try {
            if (process.env.NODE_ENV !== "production") {
                logger.info(nameChatController + "================== MENSAJE NUEVO ==================");
            }

            const token = req.cookies.token;
            if (!token) return res.status(400).render("error404", { title: "Error 404" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const { message } = req.body;
            if (!message) return res.status(400).render("error404", { title: "Error 404" });

            const userState = ChatController.conversationState[userId] || {};
            if (process.env.NODE_ENV !== "production") {
                logger.info(nameChatController + "========== USER STATE ==========");
                logger.info(userState);
                logger.info(nameChatController + "================================");
            }
            if (!userState.awaitingRequisitos) {
                userState.awaitingRequisitos = false;
            }

            // Si el usuario está esperando los requisitos
            if (userState.awaitingRequisitos) {
                if (process.env.NODE_ENV !== "production") {
                    logger.info(nameChatController + "========== userState.intent ==========");
                    logger.info(userState.intent);
                    logger.info(nameChatController + "========== intentKey ==========");
                    logger.info(userState.intent);
                    logger.info(nameChatController + "========== MENSAJE REQUISITOS ==========");
                    logger.info(message);
                    logger.info(nameChatController + "================================");
                }

                const intentKey = userState.intent;
                const requisitos = requisitosDetails[`${intentKey}`];
                const otro_mensaje = "OK, en que más te puedo ayudar";

                if (message.toLowerCase().includes("si")) {
                    ChatController.conversationState[userId] = {
                        intent: userState.intent,
                        awaitingRequisitos: false
                    };
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameChatController + "========== requisitos ==========");
                        logger.info(requisitos);
                        logger.info(nameChatController + "================================");
                    }
                    const intentUrl = `/pdf?intent=${intentKey}`;
                    const requisitosConIntent = requisitos.replace("/pdf", intentUrl);
                    return res.json({ reply: requisitosConIntent });
                };

                ChatController.conversationState[userId] = {}
                return res.json({ reply: otro_mensaje});
            }

            // Si el usuario está esperando una respuesta
            if (userState.awaitingResponse && userState.intent) {
                const followUp = intentFollowUp[userState.intent];
                const response = followUp[message.toLowerCase()] || "No entendí tu respuesta XD.";
                if (process.env.NODE_ENV !== "production") {
                    logger.info(nameChatController + "========== follow ==========");
                    logger.info(followUp);
                    logger.info(nameChatController + "========== response ==========");
                    logger.info(response);
                    logger.info(nameChatController + "================================");
                }

                if (message.toLowerCase() === "requisitos") {
                    const intentKey = userState.intent.split('_')[1];
                    ChatController.conversationState[userId] = { intent: userState.intent, awaitingRequisitos: true };
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameChatController + "========== MENSAJE ==========");
                        logger.info(ChatController.conversationState[userId].intent);
                        logger.info(nameChatController + "================================");
                    }
                    return res.json({ reply: "Entendido, te detallo los requisitos." });
                }

                if (userState.intent === "consulta_tarjeta" || userState.intent === "consulta_seguro") {
                    const opcionSeleccionada = message.toLowerCase();
                    if (process.env.NODE_ENV !== "production") {
                        logger.info(nameChatController + "========== OPCION ==========");
                        logger.info(opcionSeleccionada);
                        logger.info(nameChatController + "================================");
                    }
                    if (["clasica", "oro", "black", "vida", "salud", "auto"].includes(opcionSeleccionada)) {
                        ChatController.conversationState[userId] = { intent: `${opcionSeleccionada}`, awaitingRequisitos: true };
                        if (process.env.NODE_ENV !== "production") {
                            logger.info(nameChatController + "============== SELECCION TARJETA O SEGURO ==============");
                            logger.info(ChatController.conversationState[userId].intent);
                            logger.info(nameChatController + "======================================================");
                        }
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

            if (process.env.NODE_ENV !== "production") {
                logger.info(nameChatController + "========== response.data.intents ==========");
                logger.info(response.data.intents);
                logger.info(nameChatController + "========== intent ==========");
                logger.info(response.data.intents?.[0]?.name || "unknown");
                logger.info(nameChatController + "================================");
            }

            let intent = response.data.intents?.[0]?.name || "unknown";
            const reply = intentResponses[intent] || intentResponses["unknown"];

            if (intentFollowUp[intent]) {
                ChatController.conversationState[userId] = { awaitingResponse: true, intent };
            }

            const validation = validateChatMessage({ userId, message, response: reply });
            if (!validation.success) return res.status(400).json({ error: validation.error.errors[0].message });

            await ChatMessage.create({ userId, message, response: reply });

            return res.json({ reply });
        } catch (error) {
            logger.error(nameChatController + "ERROR EN CHATCONTROLLER:JS", error);
            return res.status(500).render("error500", { title: "Error 500" });
        }
    }
}
