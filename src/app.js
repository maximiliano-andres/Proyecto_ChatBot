import { createServer } from "./config/server.js";
import { config } from "./config/env.js";
import debug from "debug";
import ErrorHandler from "./shared/errors/errores.js";
import router from "./interfaces/routes/rutas_vistas.js";

import { connectDB } from "./config/database.js";



const DEBUG = debug("app:APP_CHATBOT");


// Creador del Servidor
const app = createServer();


// Conectar a MongoDB
connectDB().then(() => {
    DEBUG("BD conectada Exitosamente");
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
app.use("/perfil", router);

app.use("/chatbot", router);

app.use("/pdf", router);

//URL OCULTA SOLO PARA ADMINISTRADOR
app.use("/registro_usuario/ADMINISTRADOR2025", router);
app.use("/tablas", router);

//./public/img/Logo_Cuadro.png

app.use(ErrorHandler.error404);
app.use(ErrorHandler.error500);




// Iniciar servidor
app.listen(config.port, "0.0.0.0", () => {
    DEBUG("Servidor corriendo en http://localhost:" + config.port);
    //console.log("Servidor corriendo en http://localhost:" + config.port);
});