import debug from 'debug';
import dotenv from 'dotenv';
import env from "env-var";

dotenv.config();

const DEBUG = debug("app: ENV.JS")

export const config = {
    port: env.get("PUERTO").required().asIntPositive(),
    nodeEnv: env.get("APP_SECRET").default("Jocelyn-Lisette-Maximiliano-Ramiro").asString(),
    WIT_AI_TOKEN: env.get("WIT_TOKEN").required().asString(),
    MONGO_URI: env.get("MONGO_URI").required().asString()
};

// Verificar si alguna variable importante no está definida
Object.entries(config).forEach(([key, value]) => {
    if (!value) {
        DEBUG("ERROR");
        console.error(`ERROR: La variable de entorno ${key} no está definida.`);
        process.exit(1); // Detiene la ejecución si faltan variables críticas
    }
});

DEBUG("Configuración cargada correctamente");