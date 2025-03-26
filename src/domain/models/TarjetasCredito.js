import mongoose from "mongoose";

const tarjetasCreditoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    numero_tarjeta: { type: String, required: true, unique: true, match: /^\d{4}-\d{4}-\d{4}-\d{4}$/ },
    fecha_expiracion: { type: String, required: true, match: /^(0[1-9]|1[0-2])\/\d{2}$/ }, // MM/YY
    cvv: { type: String, required: true, match: /^\d{3}$/ }, // Código de seguridad
    limite_credito: { type: Number, required: true },
    saldo_disponible: { type: Number, required: true },
    estado: { type: String, enum: ["activa", "bloqueada", "vencida"], default: "activa" },
    fecha_emision: { type: Date, default: Date.now }
});

export const CreditCard = mongoose.model("TarjetasCredito", tarjetasCreditoSchema);
