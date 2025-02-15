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
        <div class="avatar ${isUser ? 'user-avatar' : 'bot-avatar'}">${isUser ? 'U' : 'Ai'}</div>
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

// Adjust padding dynamically
function updateChatPadding() {
    const inputHeight = document.querySelector('.input-wrapper').offsetHeight;
    chatMessages.style.paddingBottom = `${inputHeight + 20}px`;
}

// Ensure correct layout adjustments
window.addEventListener('load', updateChatPadding);
window.addEventListener('resize', updateChatPadding);
