(function () {
  // 1. Bot ID nikalo script tag se
  const script = document.currentScript
  const botId = script.getAttribute('data-bot-id')
  if (!botId) return

  // 2. API URL
  const API_URL = script.src.replace('/widget.js', '')

  // 3. Styles inject karo
  const style = document.createElement('style')
  style.innerHTML = `
    #docbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
      font-size: 22px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    }
    #docbot-window {
      position: fixed;
      bottom: 88px;
      right: 24px;
      width: 360px;
      height: 500px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    #docbot-window.open { display: flex; }
    #docbot-header {
      padding: 16px;
      background: #000;
      color: #fff;
      font-weight: 600;
      font-size: 15px;
    }
    #docbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .docbot-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    .docbot-msg.user {
      background: #000;
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .docbot-msg.bot {
      background: #f3f4f6;
      color: #111;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    #docbot-input-area {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    #docbot-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    #docbot-send {
      padding: 8px 16px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
  `
  document.head.appendChild(style)

  // 4. HTML inject karo
  document.body.innerHTML += `
    <div id="docbot-bubble">💬</div>
    <div id="docbot-window">
      <div id="docbot-header">DocBot</div>
      <div id="docbot-messages">
        <div class="docbot-msg bot">Hello! How can I help you?</div>
      </div>
      <div id="docbot-input-area">
        <input id="docbot-input" type="text" placeholder="Type a message..." />
        <button id="docbot-send">Send</button>
      </div>
    </div>
  `

  // 5. Bubble click — window toggle
  document.getElementById('docbot-bubble').onclick = function () {
    document.getElementById('docbot-window').classList.toggle('open')
  }

  // 6. Send message
  async function sendMessage() {
    const input = document.getElementById('docbot-input')
    const messages = document.getElementById('docbot-messages')
    const question = input.value.trim()
    if (!question) return

    // User message dikhao
    messages.innerHTML += `<div class="docbot-msg user">${question}</div>`
    input.value = ''
    messages.scrollTop = messages.scrollHeight

    // Loading dikhao
    messages.innerHTML += `<div class="docbot-msg bot" id="docbot-loading">Thinking...</div>`
    messages.scrollTop = messages.scrollHeight

    // API call
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botId, question })
    })
    const data = await res.json()

    // Loading hatao, answer dikhao
    document.getElementById('docbot-loading').remove()
    messages.innerHTML += `<div class="docbot-msg bot">${data.answer}</div>`
    messages.scrollTop = messages.scrollHeight
  }

  // 7. Send button click
  document.getElementById('docbot-send').onclick = sendMessage

  // 8. Enter key se bhi send ho
  document.getElementById('docbot-input').onkeydown = function (e) {
    if (e.key === 'Enter') sendMessage()
  }
})()