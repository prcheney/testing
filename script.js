const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const API_URL = "https://your-api-url-here"; // Replace with your GPT API endpoint
const API_KEY = "your-api-key-here"; // Replace with your API key

function addMessage(text, isUser = true) {
  const message = document.createElement("div");
  message.className = `message ${isUser ? "user" : "bot"}`;
  message.innerText = text;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";

  addMessage("Thinking...", false);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Specify the model you want to use
        messages: [{ role: "user", content: message }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      chatContainer.lastChild.remove(); // Remove "Thinking..."
      addMessage(botMessage, false);
    } else {
      throw new Error("Error communicating with GPT.");
    }
  } catch (error) {
    chatContainer.lastChild.remove(); // Remove "Thinking..."
    addMessage("Error: Unable to reach the server.", false);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
