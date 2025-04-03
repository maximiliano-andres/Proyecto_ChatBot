
//COntroladores de las vistas
class AuthControllers {

    static loginpage (req,res){
        try {
            return res.status(200).render("login",
                {
                    title: "Login ChatBot", error:""
                }
            )
            
        } catch (error) {
            console.error("Error en login_page:", error);
            return res.status(500).render("error500", {
                title: "Error 500", 
            });
        }
    };

    static registropage (req,res){
        try {
            return res.status(200).render("registro",
                {
                    title: "Registro de Usuario",error: ""
                })
        } catch (error) {
            console.error("Error en registro_page:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    };
};


export default AuthControllers;