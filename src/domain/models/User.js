import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";

const nameUser = "VELIDADOR MODELO USER: ";

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

// Validación con Zod
export const validateUser = (data) => {
    const schema = z.object({
        nombre1: z.string().min(1, "El primer nombre no puede estar vacío.").transform(val => val.trim().toUpperCase()),
        nombre2: z.string().min(1, "El segundo nombre no puede estar vacío.").transform(val => val.trim().toUpperCase()),
        apellido1: z.string().min(1, "El primer apellido no puede estar vacío.").transform(val => val.trim().toUpperCase()),
        apellido2: z.string().min(1, "El segundo apellido no puede estar vacío.").transform(val => val.trim().toUpperCase()),
        rut: z.string().regex(/^\d{7,8}-[0-9kK]{1}$/, "El RUT debe tener el formato 12345678-9."),
        numero_documento: z.string().regex(/^\d{3}\.\d{3}\.\d{3}$/, "El número de documento debe tener el formato 123.456.789."),
        telefono: z.string().regex(/^\+569\d{8}$/, "El teléfono debe tener el formato +569XXXXXXXX."),
        fecha_nacimiento: z.string().refine((val) => {
            const today = new Date();
            const birthDate = new Date(val);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        }, { message: "Debes tener al menos 18 años para registrarte." }),
        email: z.string().email("El formato del correo electrónico no es válido."),
        password: z.string()
            .min(8, "La contraseña debe tener al menos 8 caracteres.")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*?&)."),
        role: z.enum(["cliente", "admin"]).optional()
    });
    return schema.safeParse(data);
};
