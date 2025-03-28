// ChatController.js - Manejo avanzado de intents y selección de tarjetas y seguros

import axios from "axios";
import { config } from "../../config/env.js";
import { ChatMessage, validateChatMessage } from "../../domain/models/ChatMessage.js";
import { User } from "../../domain/models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import env from "env-var";
import debug from "debug";

const DEBUG = debug("app: CHAT:CONTROLLER:JS : ");
dotenv.config();

const WIT_AI_TOKEN = env.get("WIT_TOKEN").required().asString();

const intentResponses = {
    saludo: "¡Hola! ¿En qué puedo ayudarte hoy?",
    despedida: "¡Hasta luego! Si necesitas algo más, aquí estaré.",
    consulta_prestamo: "Ofrecemos préstamos personales con tasas competitivas. ¿Te gustaría saber los requisitos?",
    consulta_tarjeta: "Tenemos tarjetas de crédito con diferentes beneficios. ¿Te interesa la Clásica, Oro o Black? (Solo escribe :'CLASICA' , 'ORO' o 'BLACK')",
    consulta_seguro: "Brindamos seguros de vida, salud y auto. ¿Cuál te interesa?",
    requisitos: "Puedo proporcionarte los requisitos para tarjetas o seguros. ¿Te gustaría conocerlos antes de contratar?",
    unknown: "Lo siento, no entiendo tu consulta. ¿Podrías reformularla?"
};

const intentFollowUp = {
    consulta_prestamo: { si: `Requisitos para Solicitar un Préstamo Financiero...`, no: "Bueno, ¿en qué más te puedo ayudar?" },
    consulta_tarjeta: {
        clasica: "La tarjeta Clásica tiene un límite de crédito estándar y pocos requisitos. ¿Te gustaría solicitarla o conocer sus requisitos?",
        oro: "La tarjeta Oro requiere ingresos comprobables de al menos $50,000 mensuales. ¿Te interesa solicitarla o conocer sus requisitos?",
        black: "La tarjeta Black ofrece beneficios premium y altos límites de crédito. ¿Te gustaría solicitarla o conocer sus requisitos?"
    },
    consulta_seguro: {
        vida: "El seguro de vida ofrece cobertura total en caso de fallecimiento o invalidez. ¿Te interesa contratarlo o conocer sus requisitos?",
        salud: "El seguro de salud cubre emergencias y consultas médicas. ¿Te interesa contratarlo o conocer sus requisitos?",
        auto: "El seguro de auto protege contra daños y robos. ¿Te interesa contratarlo o conocer sus requisitos?"
    }
};

const requisitosDetails = {
    tarjeta_clasica: "Requisitos de la Tarjeta Clásica: Ingreso mínimo de $20,000, identificación oficial vigente y comprobante de domicilio.",
    tarjeta_oro: "Requisitos de la Tarjeta Oro: Ingreso mínimo de $50,000, identificación oficial vigente, comprobante de domicilio y buen historial crediticio.",
    tarjeta_black: "Requisitos de la Tarjeta Black: Ingreso mínimo de $100,000, identificación oficial vigente, comprobante de domicilio, excelente historial crediticio y antigüedad laboral de 2 años.",
    seguro_vida: "Requisitos del Seguro de Vida: Identificación oficial vigente, cuestionario médico y comprobante de domicilio.",
    seguro_salud: "Requisitos del Seguro de Salud: Identificación oficial vigente, cuestionario médico y comprobante de domicilio.",
    seguro_auto: "Requisitos del Seguro de Auto: Identificación oficial vigente, documentos del vehículo y comprobante de domicilio."
};

const intentFinalSteps = {
    tarjeta_clasica: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Clásica", no: "Entendido, ¿en qué más puedo ayudarte?" },
    tarjeta_oro: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Oro", no: "Entendido, ¿en qué más puedo ayudarte?" },
    tarjeta_black: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Black", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_vida: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Vida", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_salud: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Salud", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_auto: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Auto", no: "Entendido, ¿en qué más puedo ayudarte?" }
};

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

                const intentKey = userState.intent.split('_')[1];  // Extrae la parte relevante del intent (ej. "oro")
                DEBUG("========== intentKey ==========");
                DEBUG(intentKey);

                const requisitos = requisitosDetails[`tarjeta_${intentKey}`] || "No se encontraron requisitos para esta opción.";

                // Mantener awaitingRequisitos en false para no repetir la respuesta
                ChatController.conversationState[userId] = {
                    intent: userState.intent,
                    awaitingRequisitos: false
                };
                DEBUG("========== requisitos ==========");
                DEBUG(requisitos);

                return res.json({ reply: requisitos });
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
                        ChatController.conversationState[userId] = { intent: `tarjeta_${opcionSeleccionada}`, awaitingRequisitos: true };
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
