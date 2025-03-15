

class ErrorHandler {
    static error404(err, req, res, next) {
        console.error('Error:', err.message);
        
        return res.status(404).render("error404",{
            title: "Error 404"
        });
    }

    static error500(err, req, res, next) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Error de código interno del servidor' });
    }
}

export default ErrorHandler;
