import mongoose from "mongoose";

const prestamosPersonalesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    monto: { type: Number, required: true, min: 50000 }, // Monto mínimo de préstamo
    plazo_meses: { type: Number, required: true, min: 3, max: 60 }, // Plazo entre 3 y 60 meses
    tasa_interes: { type: Number, required: true, min: 0 },
    estado: { type: String, enum: ["pendiente", "aprobado", "rechazado", "pagado"], default: "pendiente" },
    fecha_solicitud: { type: Date, default: Date.now },
    fecha_aprobacion: { type: Date },
    fecha_vencimiento: { type: Date }
});

export const Loan = mongoose.model("Prestamos_Personales", prestamosPersonalesSchema);
