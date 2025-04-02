import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { User, validateUser } from "../../domain/models/User.js";
import { config } from "../../config/env.js";
import debug from "debug";

import dotenv from 'dotenv';
import env from "env-var";
import validator from 'validator';

const DEBUG = debug("app:AuthControoller ");

dotenv.config();

const JWT_SECRET = env.get("JWT_SECRET").asString();

export default class AuthController {
    static async register(req, res) {
        try {
            // Validar datos con Joi
            //DEBUG("Datos recibidos:", req.body);
            const { error } = validateUser(req.body);
            if (error) return res.status(400).render("registro",{title:"Login", error: error.details.map(err => err.message) });

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) return res.status(400).render("registro",{ error: "El Email ya está registrado" });

            const existingRut = await User.findOne({ rut: req.body.rut });
            if (existingRut) return res.status(400).render("registro",{ error: "El rut ya está registrado" });

            const existingNumero_documento = await User.findOne({ numero_documento: req.body.numero_documento });
            if (existingNumero_documento) return res.status(400).render("registro",{ error: "El Numero de Documento ya está registrado" });

            const existingTelefono = await User.findOne({ telefono: req.body.telefono });
            if (existingTelefono) return res.status(400).render("registro",{ error: "El telefono ya está registrado" });
            
            // Crear nuevo usuario con la contraseña hasheada
            const user = new User({
                nombre1: req.body.nombre1.trim(),
                nombre2: req.body.nombre2.trim(),
                apellido1: req.body.apellido1.trim(),
                apellido2: req.body.apellido2.trim(),
                rut: req.body.rut.trim(),
                numero_documento: req.body.numero_documento.trim(),
                telefono: req.body.telefono.trim(),
                fecha_nacimiento: req.body.fecha_nacimiento,
                email: req.body.email.trim(),
                password: req.body.password.trim(),
                role: req.body.role || 'cliente',  // Asignación de rol por defecto si no se especifica
            });
            

            await user.save();
            DEBUG("Usuario registrado exitosamente");

            // Generar el token JWT
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    nombre1: user.nombre1,
                    nombre2: user.nombre2,
                    apellido1: user.apellido1,
                    apellido2: user.apellido2,
                    rut: user.rut,
                    role: user.role,
                    telefono: user.telefono
                },
                JWT_SECRET,  // Clave secreta desde configuración
                { expiresIn: "1h" }  // Tiempo de expiración del token
            );
            

            //DEBUG("Token Exitoso");
            // Guardar el token en una cookie HTTP-only (más seguro)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",  // Solo en producción
                maxAge: 3600000 // 1 hora en milisegundos
            });

            //DEBUG("Usuario registrado");
            //DEBUG("TOKEN: " + token);
            DEBUG("TODO SALIO BIEN SIIIIIIIIIIIIIIIIIIIIUUUUUUUUUUUUUUUUUU!!!!!!!");

            return res.render("index", { token: token ,
                title: 'Raíz Finanziera',
                titulo_1: "Bienvenido a Raíz Finanziera",
                subtitulo:"Seguridad, crecimiento y confianza en cada inversión.",
                titulo_NH:"Nuestra Historia",
                texto_NH1:"En Raíz Finanziera, creemos que el éxito financiero se construye sobre bases sólidas de confianza, estrategia y compromiso. Desde nuestra fundación en 2025, hemos trabajado incansablemente para ofrecer soluciones financieras innovadoras, adaptadas a las necesidades de nuestros clientes."

            });
            

        } catch (error) {
            console.error("Error en Registro:", error);
            return res.status(500).render("error500", {
                title: "Error 500"
            });
        }
    }



    static async login(req, res) {
        try {

            //console.log("Datos recibidos:", req.body);

            let { email, password } = req.body;

            email = email.trim();

            //DEBUG(email)

            //DEBUG("Datos recibidos:", req.body);

            if (!email || !password) return res.status(400).render("login", { title: "Login", error: "Email y contraseña son requeridos" });

            // Verificar usuario
            const user = await User.findOne({ email });

            //DEBUG("USUARIO ");

            if (!user) {
                DEBUG("NO HAY USER QUE COINCIDA CON LAS CREDENCIALES INGRESADAS")
                return res.status(400).render("login", { title: "Login", error: "Usuario o Contraseña No son Validas" });
            }
            //DEBUG("EMAIL: " + user.email);
            //DEBUG("NOMBRE: " + user.name);
            //DEBUG("CONTRASEÑA: " + user.password);

            
            //DEBUG("Contraseña ingresada en bcrypt:", password);
            //DEBUG("Contraseña encriptada en bcrypt:", user.password);
            const validPassword = await bcrypt.compare(password, user.password);
            //DEBUG("Resultado de bcrypt.compare:", validPassword); // Esto debería ser 'true' si las contraseñas coinciden.
            
            if (!validPassword) {
                DEBUG("CONTRASEÑA INVALIDA")
                return res.status(400).render("login", { title: "Login", error: "Usuario o Contraseña No son Validas" });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    nombre1: user.nombre1,
                    nombre2: user.nombre2,
                    apellido1: user.apellido1,
                    apellido2: user.apellido2,
                    rut: user.rut,
                    role: user.role,
                    telefono: user.telefono
                },
                JWT_SECRET,  // Clave secreta desde configuración
                { expiresIn: "1h" }  // Tiempo de expiración del token
            );

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

            DEBUG("TOKEN ELIMINADO CON EXITO")
            
            return res.status(200).render('index', { 
                token: "",
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
    
    
}
