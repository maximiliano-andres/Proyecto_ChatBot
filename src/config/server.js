import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import debug from 'debug';
import morgan from 'morgan';

const DEBUG_SERVER = debug("app: SERVER.JS");

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createServer = () => {
    const app = express();
    
    app.use(morgan("dev"));
    // Seguridad: Configurar Helmet
    app.use(helmet());

    // Seguridad: Configurar CORS
    app.use(cors());

    // Habilita confianza en el proxy
    app.set('trust proxy', 1);

    // Seguridad: Limitar peticiones (Rate Limiting)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 1000, // Máximo 100 peticiones por IP
        message: 'Demasiadas peticiones, intenta más tarde'
    });
    app.use(limiter);

    // Configurar motor de vistas EJS
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../interfaces/views'));

    DEBUG_SERVER("Ruta de views:", path.join(__dirname, '../interfaces/views'));

    // Servir archivos estáticos
    app.use(express.static(path.join(__dirname, '../../public')));

    DEBUG_SERVER("RUTA PUBLIC: " + path.join(__dirname, '../../public'));
    DEBUG_SERVER("Creador del Servidor Activado")

    app.use(express.json());

    return app;
};