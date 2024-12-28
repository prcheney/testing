const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "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";

const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

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

  addMessage(message, true); // Display the user's message
  userInput.value = "";

  addMessage("Thinking...", false); // Display a placeholder message

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Specify the model
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      chatContainer.lastChild.remove(); // Remove "Thinking..."
      addMessage(botMessage, false); // Display GPT's response
    } else {
      throw new Error("API Error");
    }
  } catch (error) {
    chatContainer.lastChild.remove(); // Remove "Thinking..."
    addMessage("Error: Unable to reach the API.", false);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
