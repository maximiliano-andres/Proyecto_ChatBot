import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ContratosSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    codigo_verificador: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v),
            message: "El código verificador debe tener un formato UUID válido."
        },
        default: uuidv4
    },
    numero_tarjeta: { type: String, required: true, unique: true, match: /^\d{4}-\d{4}-\d{4}-\d{4}$/ },
    fecha_expiracion: { type: String, required: true, match: /^(0[1-9]|1[0-2])\/\d{2}$/ }, // MM/YY
    cvv: { type: String, required: true, match: /^\d{3}$/ }, // Código de seguridad
    limite_credito: { type: Number, required: true },
    saldo_disponible: { type: Number, required: true },
    estado: { type: String, enum: ["activa", "bloqueada", "vencida"], default: "activa" },
    fecha_emision: { type: Date, default: Date.now }
});

export const Contratos = mongoose.model("Contratos", ContratosSchema);
