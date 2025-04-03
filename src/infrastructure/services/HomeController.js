class HomeController {
    static index(req, res) {
        try {

            const token = req.cookies.token || "";
            const title = "Raiz Finaciera"

            return res.status(200).render('index', { token, title
            });
        } catch (error) {
            console.error("Error en Home:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }
}

export default HomeController;