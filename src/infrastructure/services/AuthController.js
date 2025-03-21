import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { User, validateUser } from "../../domain/models/User.js";
import { config } from "../../config/env.js";
import debug from "debug";

import dotenv from 'dotenv';
import env from "env-var";

const DEBUG = debug("app:AuthControoller ");

dotenv.config();

const JWT_SECRET = env.get("JWT_SECRET").asString();

export default class AuthController {
    static async register(req, res) {
        try {
            // Validar datos con Joi
            DEBUG("Datos recibidos:", req.body);
            const { error } = validateUser(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message, nombre: "Validador" });

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) return res.status(400).json({ error: "El usuario ya está registrado" });

            // Hashear la contraseña antes de guardar
            //const salt = await bcrypt.genSalt(10);
            //const hashedPassword = await bcrypt.hash(req.body.password.trim(), salt);

            // Crear nuevo usuario con la contraseña hasheada
            const user = new User({
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: req.body.password.trim()
            });

            await user.save();
            DEBUG("Usuario registrado exitosamente");

            // Generar el token JWT
            const token = jwt.sign(
                { id: user._id, email: user.email },  // Payload del token
                JWT_SECRET,                   // Clave secreta desde configuración
                { expiresIn: "1h" }                  // Tiempo de expiración del token
            );

            DEBUG("Token Exitoso");
            // Guardar el token en una cookie HTTP-only (más seguro)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",  // Solo en producción
                maxAge: 3600000 // 1 hora en milisegundos
            });

            DEBUG("Usuario registrado");
            DEBUG("TOKEN: " + token);
            DEBUG("TODO SALIO BIEN SIIIIIIIIIIIIIIIIIIIIUUUUUUUUUUUUUUUUUU!!!!!!!");

            return res.render("index", { token: token ,
                title: 'Raíz Finanziera',
                titulo_1: "Bienvenido a Raíz Finanziera",
                subtitulo:"Seguridad, crecimiento y confianza en cada inversión.",
                titulo_NH:"Nuestra Historia",
                texto_NH1:"En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes."

            });
            

        } catch (error) {
            DEBUG("ERROR");
            console.error("Error en registro:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }



    static async login(req, res) {
        try {

            console.log("Datos recibidos:", req.body);

            const { email, password } = req.body;

            DEBUG("Datos recibidos:", req.body);

            if (!email || !password) return res.status(400).json({ error: "Email y contraseña son requeridos" });

            // Verificar usuario
            const user = await User.findOne({ email });

            DEBUG("USUARIO ");
            DEBUG("EMAIL: " + user.email);
            DEBUG("NOMBRE: " + user.name);
            DEBUG("CONTRASEÑA: " + user.password);

            if (!user) return res.status(400).json({ error: "Credenciales incorrectas EMAIL" });

            // Verificar contraseña

             // Verifica el valor del hash

            
            console.log("Contraseña ingresada en bcrypt:", password);
            console.log("Contraseña encriptada en bcrypt:", user.password);
            const validPassword = await bcrypt.compare(password, user.password);
            console.log("Resultado de bcrypt.compare:", validPassword); // Esto debería ser 'true' si las contraseñas coinciden.
            
            if (!validPassword) return res.status(400).json({ error: "Credenciales incorrectas PASSWORD" });

            // Generar token JWT
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

            // Establecer la cookie con el token
            res.cookie("token", token, {
                httpOnly: true, // La cookie solo es accesible por el servidor
                secure: process.env.NODE_ENV === "production", // Solo en producción
                sameSite: 'Strict' // La cookie no se envía en solicitudes de origen cruzado
            });

            DEBUG("Inicio de sesión exitoso");

            const usuario = user.name; 
            
            return res.render("index", { token: token ,
                title: 'Raíz Finanziera',
                titulo_1: "Bienvenido a Raíz Finanziera",
                subtitulo:"Seguridad, crecimiento y confianza en cada inversión.",
                titulo_NH:"Nuestra Historia",
                texto_NH1:"En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes."

            });


        } catch (error) {
            console.error("Error en login:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }



    static async logout(req, res) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", 
                sameSite: "Strict"
            });
    
            // Forzar expiración
            res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    
            return res.redirect("/");
        } catch (error) {
            console.error("Error en logout:", error);
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
    }
    
    
}
