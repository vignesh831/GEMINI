const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Enable send button when input is not empty
userInput.addEventListener("input", () => {
    sendButton.disabled = userInput.value.trim() === "";
});

// Send message on button click
sendButton.addEventListener("click", sendMessage);

// Send message on Enter key press (without Shift)
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    displayMessage(message, "user");

    // Disable input & button while processing
    userInput.value = "";
    sendButton.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        displayMessage(data.reply, "bot");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Error: Unable to reach the server.", "bot");
    }

    // Re-enable input & button
    sendButton.disabled = false;
}

// Function to display messages
function displayMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar", sender === "user" ? "user-avatar" : "bot-avatar");
    avatar.textContent = sender === "user" ? "U" : "G";

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.innerHTML = `<p>${text}</p>`;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Auto-scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
