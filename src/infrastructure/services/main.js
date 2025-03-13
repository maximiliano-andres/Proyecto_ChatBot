class HomeController {
    static index(req, res) {
        try {
            res.render('index', { 
                title: 'ChatBot',
                titulo_1: "Prueba de Vista Del Futuro Chat-Bot",
                
            });
        } catch (error) {
            console.error('Error en HomeController.index:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

export default HomeController;