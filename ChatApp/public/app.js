// app.js
const socket = io();

// Get references to DOM elements
const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');

const chatSection = document.getElementById('chat-section');
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

let username = '';
let userId = '';  // This will store the current user's socket ID

// Show the chat section after the user enters their name
startChatButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        usernameContainer.style.display = 'none';
        chatSection.style.display = 'block';
    }
});

// Listen for form submission to send a message
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent form from submitting the traditional way
    const message = messageInput.value.trim();

    if (message) {
        // Emit the message to the server along with the user's name
        socket.emit('chat message', { name: username, message });

        // Clear the input
        messageInput.value = '';
    }
});

// Listen for incoming messages from the server
socket.on('chat message', (data) => {
    const { id, name, message } = data;
    const messageElement = document.createElement('div');

    // Display "You" for the current user's messages, and the actual name for others
    if (id === userId) {
        messageElement.textContent = `You: ${message}`;
    } else {
        messageElement.textContent = `${name}: ${message}`;
    }

    messagesDiv.appendChild(messageElement);

    // Automatically scroll to the latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Get the current user's socket ID
socket.on('connect', () => {
    userId = socket.id;
});
