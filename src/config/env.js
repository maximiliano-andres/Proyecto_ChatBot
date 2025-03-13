import dotenv from 'dotenv';
import env from "env-var";

dotenv.config();

export const config = {
    port: env.get("Puerto").required().asIntPositive() || 3000,
    nodeEnv: env.get("Contraseña_Obligatoria").required() || "Jocelyn-Lisette-Maximiliano-Ramiro"
};