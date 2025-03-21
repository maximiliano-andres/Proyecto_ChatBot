import { createServer } from "./config/server.js";
import { config } from "./config/env.js";
import debug from "debug";
import ErrorHandler from "./shared/errors/errores.js";
import router from "./interfaces/routes/rutas_vistas.js";

import { connectDB } from "./config/database.js";


const DEBUG = debug("app:APLICACION_CHATBOT");


// Creador del Servidor
const app = createServer();


// Conectar a MongoDB
connectDB().then(() => {
    DEBUG("MongoDB conectado exitosamente");
}).catch(error => {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1); // Detener si no se puede conectar a la BD
});


// Cargar rutas
app.use("/", router);
app.use("/Finanzas_Raiz",router);
app.use("/login", router);
app.use("/logout", router);
app.use("/registro_usuario", router);
app.use("/chatbot", router);



// Middleware para manejo de errores
app.use(ErrorHandler.error404);  
app.use(ErrorHandler.error500);  



// Iniciar servidor
app.listen(config.port, "0.0.0.0", () => {
    DEBUG("Servidor corriendo en http://localhost:" + config.port);
    //console.log("Servidor corriendo en http://localhost:" + config.port);
});