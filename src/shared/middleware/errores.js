

class ErrorHandler {
    static error400(err, req, res, next) {
        console.error('Error:', err.message);
        res.status(400).json({ error: 'Error Navegador' });
    }

    static error500(err, req, res, next) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Error de código interno del servidor' });
    }
}

export default ErrorHandler;
