import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import debug from 'debug';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

const DEBUG_SERVER = debug("app: SERVER.JS");

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const createServer = () => {
    const app = express();
    
    // Ayuda a Ver solicitudes en consola
    app.use(morgan("dev"));

    // Seguridad: Configurar Helmet
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],

                    styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.jsdelivr.net"],
                    fontSrc: ["'self'", "fonts.gstatic.com"],
                    imgSrc: ["'self'", "data:"],
                    connectSrc: ["'self'"],
                },
            },
            xssFilter: true, // Evita ataques XSS
            noSniff: true, // Evita ataques de MIME sniffing
            frameguard: { action: "deny" }, // Previene Clickjacking
        })
    );

    
    // Seguridad: Configurar CORS de manera más estricta
    app.use(
        cors({
            origin: ["https://midominio.com", "https://subdominio.midominio.com"], // Restringir a dominios específicos
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true, // Permite cookies en CORS
            optionsSuccessStatus: 200,
        })
    );

    // Habilita confianza en el proxy
    app.set('trust proxy', 1);

    // Middleware para procesar JSON y URL encoded
    app.use(express.json({ limit: "10kb" })); // Evita payloads demasiado grandes
    app.use(express.urlencoded({ extended: true, limit: "10kb" }));
    app.use(cookieParser());

    // Middleware para analizar los datos del cuerpo de la solicitud
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Seguridad: Limitar peticiones (Rate Limiting)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 500, // Máximo 200 peticiones por IP
        message: "Demasiadas peticiones, intenta más tarde.",
        standardHeaders: true, // Muestra límites en headers
        legacyHeaders: false, // No usa headers obsoletos
    });
    
    app.use(limiter);

    // Seguridad: Evita inyecciones NoSQL
    app.use(mongoSanitize());

    // Seguridad: Evita ataques de contaminación de parámetros HTTP
    app.use(hpp());

    // Configurar motor de vistas EJS
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../interfaces/views'));

    //DEBUG_SERVER("Ruta de views:", path.join(__dirname, '../interfaces/views'));

    // Servir archivos estáticos
    app.use(express.static(path.join(__dirname, '../../public')));

    //DEBUG_SERVER("RUTA PUBLIC: " + path.join(__dirname, '../../public'));
    DEBUG_SERVER("Servidor Activado")


    return app;
};