import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";

// Esquema de usuario
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now }
});

// Middleware para encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    console.log("Contraseña al ser encriptada:", this.password);  // Verifica cómo es la contraseña antes de encriptarla
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Contraseña encriptada:", this.password);
    next();
});

// Modelo de Mongoose
export const User = mongoose.model("User", userSchema);

// Validación con Joi
export const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required().messages({
            "string.email": "El formato del email es inválido.",
            "any.required": "El email es obligatorio."
        }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
            .required()
            .messages({
                "string.min": "La contraseña debe tener al menos 8 caracteres.",
                "string.pattern.base": "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).",
                "any.required": "La contraseña es obligatoria."
            }),
        role: Joi.string().valid("user", "admin")
    });

    // `abortEarly: false` para devolver todos los errores juntos
    return schema.validate(data, { abortEarly: false }); 
};