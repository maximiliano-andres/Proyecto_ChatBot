import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Raíz Financiera',
        version: '1.0.0',
        description: 'Documentación de la API del ChatBot Bancario',
    },
    servers: [
        {
            url: 'http://localhost:1010',
            description: 'Servidor local para  Universidad Mayor',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    

};

const options = {
    swaggerDefinition,
    apis: ['./src/interfaces/routes/rutas_vistas.js'],
};

export default swaggerJSDoc(options);