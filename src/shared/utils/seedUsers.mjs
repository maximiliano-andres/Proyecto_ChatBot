import axios from 'axios';
import { logger } from '../../config/logger.js';

const BASE_URL = 'http://localhost:1010/registro_usuario';

const usuarios = Array.from({ length: 20 }).map((_, i) => ({
    nombre1: `Nombre${i}`,
    nombre2: `Segundo${i}`,
    apellido1: `Apellido${i}`,
    apellido2: `ApellidoDos${i}`,
    rut: `1234567${i}-K`,
    numero_documento: `DOC000${i}`,
    telefono: `91234567${i}`,
    fecha_nacimiento: '1990-01-01',
    email: `user${i}@test.com`,
    password: `Password123!`,
    role: 'cliente'
}));

export const registrarUsuarios = async () => {
    for (const user of usuarios) {
        try {
            const response = await axios.post(BASE_URL, user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (process.env.NODE_ENV !== "production") {
                logger.info(`✅ Usuario ${user.email} registrado:`, response.status);
            }
        } catch (error) {
            if (error.response) {
                logger.error(`❌ Error en ${user.email}:`, error.response.data?.error || error.response.statusText);
            } else {
                logger.error(`❌ Fallo general:`, error.message);
            }
        }
    }
};

registrarUsuarios();
