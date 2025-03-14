import { createServer } from "./config/server.js";
import { config } from "./config/env.js";
import debug from "debug";
import ErrorHandler from "./shared/errors/errores.js";
import router from "./interfaces/routes/rutas_vistas.js";


const DEBUG = debug("app:INDEX_PAG-VALERIA");

const app = createServer();

// Cargar rutas
app.use("/",router);
app.use("/login", router)
app.use("/registro_usuario", router)






// Middleware para manejo de errores
app.use(ErrorHandler.error400);  
app.use(ErrorHandler.error500);  









// Iniciar servidor
app.listen(config.port || 4000, () => {
    DEBUG("Servidor corriendo en http://localhost:" + config.port);
    //console.log("Servidor corriendo en http://localhost:" + config.port);
});