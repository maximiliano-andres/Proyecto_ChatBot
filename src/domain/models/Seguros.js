import mongoose from "mongoose";

const segurosSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tipo_seguro: { type: String, enum: ["vida", "salud", "automóvil", "hogar"], required: true },
    monto_cobertura: { type: Number, required: true },
    prima_mensual: { type: Number, required: true },
    estado: { type: String, enum: ["activo", "vencido", "cancelado"], default: "activo" },
    fecha_inicio: { type: Date, required: true },
    fecha_vencimiento: { type: Date, required: true }
});

export const Insurance = mongoose.model("Seguros", segurosSchema);
