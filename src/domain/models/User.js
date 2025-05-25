import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";
import debug from "debug";

const DEBUG = debug("app: VELIDADOR MODELO USER: ")

// Esquema de usuario
const userSchema = new mongoose.Schema({
    nombre1: { type: String, required: true, uppercase: true, trim: true },
    nombre2: { type: String, required: true, uppercase: true, trim: true },
    apellido1: { type: String, required: true, uppercase: true, trim: true },
    apellido2: { type: String, required: true, uppercase: true, trim: true },
    rut: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^\d{7,8}-[0-9kK]{1}$/, 
        trim: true
    },
    numero_documento: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^\d{3}\.\d{3}\.\d{3}$/ 
    },
    telefono: { 
        type: String, 
        required: true, 
        match: /^\+569\d{8}$/ 
    },
    fecha_nacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["cliente", "admin"], default: "cliente" },
    createdAt: { type: Date, default: Date.now }
});

// Middleware para encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Modelo de Mongoose
export const User = mongoose.model("User", userSchema);

// Validación con Joi
export const validateUser = (data) => {
    const schema = Joi.object({
        nombre1: Joi.string().uppercase().trim().required()
            .messages({
                "string.empty": "El primer nombre no puede estar vacío.",
                "any.required": "El primer nombre es obligatorio."
            }),
        nombre2: Joi.string().uppercase().trim().required()
            .messages({
                "string.empty": "El segundo nombre no puede estar vacío.",
                "any.required": "El segundo nombre es obligatorio."
            }),
        apellido1: Joi.string().uppercase().trim().required()
            .messages({
                "string.empty": "El primer apellido no puede estar vacío.",
                "any.required": "El primer apellido es obligatorio."
            }),
        apellido2: Joi.string().uppercase().trim().required()
            .messages({
                "string.empty": "El segundo apellido no puede estar vacío.",
                "any.required": "El segundo apellido es obligatorio."
            }),
        rut: Joi.string().pattern(/^\d{7,8}-[0-9kK]{1}$/).required()
            .messages({
                "string.pattern.base": "El RUT debe tener el formato 12345678-9.",
                "string.empty": "El RUT no puede estar vacío.",
                "any.required": "El RUT es obligatorio."
            }),
        numero_documento: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}$/).required()
            .messages({
                "string.pattern.base": "El número de documento debe tener el formato 123.456.789.",
                "string.empty": "El número de documento no puede estar vacío.",
                "any.required": "El número de documento es obligatorio."
            }),
        telefono: Joi.string().pattern(/^\+569\d{8}$/).required()
            .messages({
                "string.pattern.base": "El teléfono debe tener el formato +569XXXXXXXX.",
                "string.empty": "El teléfono no puede estar vacío.",
                "any.required": "El teléfono es obligatorio."
            }),
        fecha_nacimiento: Joi.date().iso().required()
            .custom((value, helpers) => {
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    return helpers.message("Debes tener al menos 18 años para registrarte.");
                }

                return value;
            })
            .messages({
                "date.base": "La fecha de nacimiento debe ser válida.",
                "date.format": "La fecha debe estar en formato ISO (YYYY-MM-DD).",
                "any.required": "La fecha de nacimiento es obligatoria."
            }),
        email: Joi.string().email().required()
            .messages({
                "string.email": "El formato del correo electrónico no es válido.",
                "string.empty": "El correo electrónico no puede estar vacío.",
                "any.required": "El correo electrónico es obligatorio."
            }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                "string.min": "La contraseña debe tener al menos 8 caracteres.",
                "string.pattern.base": "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*?&).",
                "string.empty": "La contraseña no puede estar vacía.",
                "any.required": "La contraseña es obligatoria."
            }),
        role: Joi.string().valid("cliente", "admin")
            .messages({
                "any.only": "El rol debe ser 'cliente' o 'admin'."
            })
    });

    return schema.validate(data, { abortEarly: false });
};
