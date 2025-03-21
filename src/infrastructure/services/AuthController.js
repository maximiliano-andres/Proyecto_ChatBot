import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, validateUser } from "../../domain/models/User.js";
import { config } from "../../config/env.js";

export default class AuthController {
    static async register(req, res) {
        try {
            // Validar datos con Joi
            const { error } = validateUser(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) return res.status(400).json({ error: "El usuario ya está registrado" });

            // Crear nuevo usuario
            const user = new User(req.body);
            await user.save();

            res.status(201).json({ message: "Usuario registrado exitosamente" });
        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: "Email y contraseña son requeridos" });

            // Verificar usuario
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ error: "Credenciales incorrectas" });

            // Generar token JWT
            const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });

            res.json({ message: "Inicio de sesión exitoso", token });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
}
