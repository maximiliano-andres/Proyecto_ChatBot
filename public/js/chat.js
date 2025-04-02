// public/js/chat.js
document.getElementById("chat-button").addEventListener("click", function () {
    document.getElementById("chat-box").style.display = "flex";
});

document.getElementById("close-chat").addEventListener("click", function () {
    document.getElementById("chat-box").style.display = "none";
});

document.getElementById("chat-input").addEventListener("input", function () {
    const sendButton = document.getElementById("send-button");
    sendButton.disabled = !this.value.trim();
});

document.getElementById("chat-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita saltos de línea en el input
        document.getElementById("send-button").click(); // Simula el clic en el botón de enviar
    }
});


document.getElementById("send-button").addEventListener("click", async function () {
    const inputField = document.getElementById("chat-input");
    const message = inputField.value.trim();
    if (!message) return;
    
    // Mostrar el mensaje del usuario en el chat
    const chatMessages = document.getElementById("chat-messages");
    const userMessage = document.createElement("p");
    userMessage.className = "user-message";
    userMessage.textContent = "👤 " + message;
    chatMessages.appendChild(userMessage);
    
    inputField.value = "";
    document.getElementById("send-button").disabled = true;

    try {
        const response = await fetch("/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Enviar token JWT si el usuario está autenticado
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        const botMessage = document.createElement("p");
        botMessage.className = "bot-message";
        botMessage.innerHTML = "🤖 " + (data.reply ? data.reply : "Lo siento, no entendí eso.");
        chatMessages.appendChild(botMessage);
    } catch (error) {
        console.error("Error enviando mensaje:", error);
        const errorMessage = document.createElement("p");
        errorMessage.className = "bot-message error";
        errorMessage.textContent = "Error al enviar el mensaje.";
        chatMessages.appendChild(errorMessage);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
});
