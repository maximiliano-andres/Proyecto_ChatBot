import { createServer } from "./config/server.js";
import router from "./interfaces/routes/rutas_vistas.js";
import ErrorHandler from "./shared/errors/errores.js";
import { config } from "./config/env.js";
import debug from "debug";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const DEBUG = debug("app:APP_CHATBOT");

const app = createServer();

//swager-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", router);
app.use("/Finanzas_Raiz", router);
app.use("/login", router);
app.use("/logout", router);
app.use("/registro_usuario", router);
app.use("/perfil", router);
app.use("/chatbot", router);
app.use("/pdf", router);
app.use("/registro_usuario/ADMINISTRADOR2025", router);
app.use("/tablas", router);
app.use("/grupo", router);

app.use(ErrorHandler.error403);
app.use(ErrorHandler.error404);
app.use(ErrorHandler.error500);


// Solo iniciar servidor si este archivo se ejecuta directamente
if (process.env.NODE_ENV !== "test") {
    app.listen(config.port, "0.0.0.0", () => {
        DEBUG("Servidor Activado y Corriendo en http://localhost:" + config.port);
    });
}



export default app;