import dotenv from 'dotenv';
import env from "env-var";
import { logger } from "./logger.js";

dotenv.config();

const nameEnv = "ENV: ";

export const config = {
    port: env.get("PUERTO").required().asIntPositive(),
    nodeEnv: env.get("APP_SECRET").default("Jocelyn-Lisette-Maximiliano-Ramiro").asString(),
    WIT_AI_TOKEN: env.get("WIT_TOKEN").required().asString(),
    MONGO_URI: env.get("MONGO_URI").required().asString()
};

// Verificar si alguna variable importante no está definida
Object.entries(config).forEach(([key, value]) => {
    if (!value) {
        logger.error(nameEnv + `ERROR: La variable de entorno ${key} no está definida.`);
        process.exit(1); // Detiene la ejecución si faltan variables críticas
    }
});

logger.info(nameEnv + "Configuracion cargada correctamente");