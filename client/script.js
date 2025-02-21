const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function formatMessage(text) {
    let paragraphs = text.split(/\n\n+/).map(para => {
        para = para.replace(/\*(.*?)\*/g, '<em>$1</em>')  // Italics
                   .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
                   .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => 
                        `<pre><code>${code.trim()}</code></pre>`
                   );
        return `<p>${para.trim()}</p>`;
    });

    return paragraphs.join('');
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

userInput.addEventListener('input', function() {
    autoResize(this);
    sendButton.disabled = !this.value.trim();
});

function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.id = 'loadingMessage';

    messageDiv.innerHTML = `
        <div class="avatar bot-avatar">Ai</div>
        <div class="message-content loading">
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) loadingMessage.remove();
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';
    userInput.style.height = 'auto';
    sendButton.disabled = true;

    addLoadingMessage();

    try {
        const response = await fetch('https://geminiapi-alpha.vercel.app/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        removeLoadingMessage();
        addMessage(data.reply || 'I encountered an error processing your request.', false);
    } catch (error) {
        console.error('Error:', error);
        removeLoadingMessage();
        addMessage('Sorry, there was an issue. Please check if the server is running and try again.', false);
    }
}

function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    messageDiv.innerHTML = `
        <div class="avatar ${isUser ? 'user-avatar' : 'bot-avatar'}">${isUser ? 'U' : 'G'}</div>
        <div class="message-content">${isUser ? content : formatMessage(content)}</div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// // Adjust padding dynamically
// function updateChatPadding() {
//     const inputHeight = document.querySelector('.input-wrapper').offsetHeight;
//     chatMessages.style.paddingBottom = `${inputHeight+20}px`;
// }

// // Ensure correct layout adjustments
// window.addEventListener('load', updateChatPadding);
// window.addEventListener('resize', updateChatPadding);
// Function to format AI responses and add copy button for code blocks
// Function to format AI responses and add copy button for code blocks
function formatMessage(text) {
    // Escape HTML special characters to prevent rendering issues
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert bold
    .replace(/\*(.*?)\*/g, '<i>$1</i>'); // Convert italics
    // Split text by triple backticks to isolate code blocks
    let parts = text.split(/```(\w+)?\n([\s\S]*?)```/g);
    let formattedText = "";

    for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 0) {
            // Regular text (not inside backticks)
            formattedText += `<p>${parts[i].trim()}</p>`;
        } else if (i % 3 === 1) {
            // Programming language (if specified)
            let language = parts[i] ? `language-${parts[i]}` : "language-plaintext";
            let codeContent = escapeHTML(parts[i + 1].trim());

            // Add code container with copy button
            formattedText += `
                <div class="code-container">
                    <button class="copy-button" onclick="copyToClipboard(this)">Copy</button>
                    <pre><code class="${language}">${codeContent}</code></pre>
                </div>
            `;
        }
    }

    return formattedText;
}

// Function to copy code to clipboard
function copyToClipboard(button) {
    const codeElement = button.nextElementSibling.querySelector("code");
    const textArea = document.createElement("textarea");
    textArea.value = codeElement.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    button.innerText = "Copied!";
    setTimeout(() => button.innerText = "Copy", 1500);
}


// Example usage in the chatbot response handling function
function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="avatar ${isUser ? 'user-avatar' : 'bot-avatar'}">${isUser ? 'U' : 'G'}</div>
        <div class="message-content">${isUser ? content : formatMessage(content)}</div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// CSS for chat interface
const style = document.createElement('style');
style.innerHTML = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
    }

    body {
        background-color: #f0f4f9;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .chat-container {
        flex: 1;
        max-width: 800px;
        margin: 5rem auto 2rem;
        padding: 0 1rem;
        width: 100%;
    }

    .chat-messages {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
        min-height: calc(100vh - 180px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        overflow-y: auto;
    }

    .code-container {
    position: relative;
    background-color: #f5f5f5;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5em 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
}

.code-container pre {
    margin: 0;
    width: 100%;
    display: block;
    padding: 1em;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #8e24aa;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.copy-button:hover {
    background: #6a1b9a;
}


    .input-wrapper {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        background: transparent;
        padding: 10px;
        border-radius: 25px;
        box-shadow: none;
    }

    #userInput {
        width: 100%;
        border: 2px solid #800080;
        background: transparent;
        color: #333;
        padding: 10px 15px;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
    }

    #userInput::placeholder {
        color: #888;
    }

    #sendButton {
        background: transparent;
        border: none;
        color: #888;
        cursor: pointer;
    }
`;
document.head.appendChild(style);
