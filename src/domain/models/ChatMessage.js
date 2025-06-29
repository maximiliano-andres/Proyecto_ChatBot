import mongoose from "mongoose";
import { z } from "zod";

// Esquema de Mongoose
const chatMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Modelo de Mongoose
export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

// Validación con Zod
export const validateChatMessage = (data) => {
    const schema = z.object({
        userId: z.string().min(1, "El userId es obligatorio."),
        message: z.string().min(1, "El mensaje no puede estar vacío.").max(500, "El mensaje es demasiado largo."),
        response: z.string().min(1, "La respuesta es obligatoria.")
    });
    return schema.safeParse(data);
};