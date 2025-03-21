import dotenv from 'dotenv';
import env from "env-var";

dotenv.config();

export const config = {
    port: env.get("Puerto").required().asIntPositive(),
    nodeEnv: env.get("Contraseña_Obligatoria").required() || "Jocelyn-Lisette-Maximiliano-Ramiro",
    WIT_AI_TOKEN: env.get("token").required(),
    MONGO_URI: env.get("mongo").required().asString()
};

