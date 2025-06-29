import { logger } from "../../config/logger.js";

const nameErrores = "ERRORES: ";
class ErrorHandler {
    // Middleware para manejar rutas no encontradas (Error 404)
    static error404(req, res, next) {
        return res.status(404).render("error404", {
            title: "Error 404"
        });
    }

    // Middleware para manejar errores de autorización (Error 403)
    static error403(err, req, res, next) {
        logger.error(nameErrores + 'Error 403:', err.message);
        return res.status(403).render("error43", {
            title: "Error 403"
        });
    }

    // Middleware para errores generales de la aplicación
    static error400(err, req, res, next) {
        logger.error(nameErrores + 'Error 400:', err.message);
        return res.status(404).render("error404", {
            title: "Error 404"
        });
    }

    // Middleware para errores internos del servidor
    static error500(err, req, res, next) {
        logger.error(nameErrores + 'Error 500:', err.message);
        return res.status(404).render("error500", {
            title: "Error 500"
        });
    }
}

export default ErrorHandler;