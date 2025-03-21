
//COntroladores de las vistas
class AuthControllers {

    static loginpage (req,res){
        try {
            return res.status(200).render("login",
                {
                    title: "Login ChatBot"
                }
            )
            
        } catch (error) {
            console.error('Error en AuthController.loginPage:', error);
            res.status(500).send('Error interno del servidor');            
        }
    };

    static registropage (req,res){
        try {
            return res.status(200).render("registro",
                {
                    title: "Registro de Usuario"
                })
        } catch (error) {
            console.error('Error en AuthController.registerPage:', error);
            res.status(500).send('Error interno del servidor');
        }
    };
};


export default AuthControllers;