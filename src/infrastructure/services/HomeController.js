class HomeController {
    static index(req, res) {
        try {
            return res.status(200).render('index', { 
                title: 'Raíz Finanziera',
                titulo_1: "Bienvenido a Raíz Finanziera",
                subtitulo:"Seguridad, crecimiento y confianza en cada inversión.",
                titulo_NH:"Nuestra Historia",
                texto_NH1:"En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes."

                
            });
        } catch (error) {
            console.error('Error en HomeController.index:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

export default HomeController;