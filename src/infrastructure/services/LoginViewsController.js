import { logger } from "../../config/logger.js";

const nameLoginViewsController = "LoginViewsController: ";
//COntroladores de las vistas
class AuthControllers {
    // Vista de inicio de sesión
    static loginpage(req, res) {
        try {
            return res.status(200).render("login", {
                title: "Login ChatBot",
                error: "",
            });
        } catch (error) {
            logger.error(nameLoginViewsController + `Error en Login Page: ${error}`);
            return res.status(500).render("error500", {
                title: "Error 500",
            });
        }
    }

    // Vista de registro
    static registropage(req, res) {
        try {
            return res.status(200).render("registro", {
                title: "Registro de Usuario",
                error: "",
            });
        } catch (error) {
            logger.error(nameLoginViewsController + `Error en Registro Page: ${error}`);
            return res.status(500).render("error500", {
                title: "Error 500",
            });
        }
    }

    static registropageADMIN(req, res) {
        try {
            return res.status(200).render("registroADMIN", {
                title: "Registro de Usuario",
                error: "",
            });
        } catch (error) {
            logger.error(nameLoginViewsController + `Error en Registro Page Admin: ${error}`);
            return res.status(500).render("error500", {
                title: "Error 500",
            });
        }
    }
}

export default AuthControllers;
