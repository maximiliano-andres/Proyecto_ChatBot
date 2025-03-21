import mongoose from "mongoose";
import { config } from "./env.js";
import debug from "debug";

const DEBUG_DB = debug("app:BASE_DE_DATOS");

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Evita que la conexión quede colgada
            socketTimeoutMS: 45000, // Tiempo de espera para respuestas de MongoDB
            maxPoolSize: 10, // Limita conexiones simultáneas (ajustable según la carga)
            family: 4, // Fuerza IPv4 (evita problemas de red en algunas configuraciones)
        });

        DEBUG_DB("Conectado a MongoDB correctamente");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); // Finalizar si no se puede conectar
    }
};
