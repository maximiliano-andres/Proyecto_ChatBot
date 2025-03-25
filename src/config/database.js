import mongoose from "mongoose";
import { config } from "./env.js";
import debug from "debug";

const DEBUG = debug("app:BASE_DE_DATOS");

const MONGO_URI = config.MONGO_URI || "mongodb://localhost:27017/miBaseDeDatos"; // URI por defecto

//DEBUG("BASE DE DATOS :"+ MONGO_URI);

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
            DEBUG("Conexión a MongoDB");
            
            // Manejador de eventos de conexión
            mongoose.connection.on("connected", () => DEBUG("MongoDB conectado"));
            mongoose.connection.on("error", err => DEBUG("Error en MongoDB:", err));
            mongoose.connection.on("disconnected", () => DEBUG("MongoDB desconectado"));
            
            return;
        } catch (error) {
            console.error(`Error al conectar a MongoDB (Intentos restantes: ${retries - 1}):`, error);
            DEBUG("------ BASE DE DATOS DESCONECTADA ------");
            retries--;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    
    console.error("No se pudo conectar a MongoDB después de varios intentos. Saliendo...");
    
    // Terminar la aplicación si la conexión falla
    process.exit(1); 
};
