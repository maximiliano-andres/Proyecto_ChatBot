class ErrorHandler {
    // Middleware para manejar rutas no encontradas (Error 404)
    static error404(req, res, next) {
        return res.status(404).render("error404", {
            title: "Error 404"
        });
    }

    // Middleware para errores generales de la aplicación
    static error400(err, req, res, next) {
        console.error('Error 400:', err.message);
        return res.status(400).json({ error: 'Solicitud incorrecta' });
    }

    // Middleware para errores internos del servidor
    static error500(err, req, res, next) {
        console.error('Error 500:', err.message);
        return res.status(404).render("error500", {
            title: "Error 500"
        });
    }
}

export default ErrorHandler;