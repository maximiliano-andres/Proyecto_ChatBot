import mongoose from "mongoose";
import Joi from "joi";

// Esquema de Mongoose
const chatMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Modelo de Mongoose
export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

// Validación con Joi
export const validateChatMessage = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        message: Joi.string().min(1).max(500).required(),
        response: Joi.string().required()
    });
    return schema.validate(data);
};