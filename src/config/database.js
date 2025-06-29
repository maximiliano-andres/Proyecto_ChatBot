import mongoose from "mongoose";
import { config } from "./env.js";
import { logger } from "./logger.js";

const nameDatabase = "DATABASE: ";

const MONGO_URI = config.MONGO_URI ;//|| "mongodb://localhost:27017/miBaseDeDatos"; // URI por defecto

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000, // Tiempo máximo para seleccionar un servidor
    socketTimeoutMS: 45000, // Tiempo máximo de espera para operaciones de socket
    maxPoolSize: 10, // Número máximo de conexiones simultáneas
    minPoolSize: 2,  // Mínimo de conexiones activas (mejora estabilidad)
    family: 4, // Fuerza uso de IPv4 para evitar conflictos
    autoIndex: false, // Desactiva índices automáticos en producción para mejorar rendimiento
    retryWrites: true, // Habilita reintentos de escritura en caso de fallos
    w: "majority" // Garantiza que la escritura sea confirmada por la mayoría de los nodos
};

// Función para conectar a MongoDB con reintentos
export const connectDB = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            await mongoose.connect(MONGO_URI, mongooseOptions); 
            
            // Manejador de eventos de conexión
            mongoose.connection.on("connected", () => logger.info(nameDatabase + "MongoDB conectado"));
            mongoose.connection.on("error", err => logger.error(nameDatabase + "Error en MongoDB:", err));
            mongoose.connection.on("disconnected", () => logger.warn(nameDatabase + "MongoDB desconectado"));
            
            logger.info(nameDatabase + "Conectado a MongoDB");

            return;
        } catch (error) {
            logger.error(nameDatabase + `Error al conectar a MongoDB (Intentos restantes: ${retries - 1}):`, error);
            logger.error(nameDatabase + "------ BASE DE DATOS DESCONECTADA ------");
            retries--;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    
    logger.error(nameDatabase + "No se pudo conectar a MongoDB después de varios intentos. Saliendo...");
    
    // Terminar la aplicación si la conexión falla
    process.exit(1); 
};
