(function () {
  const script = document.currentScript
  const botId = script.getAttribute('data-bot-id')
  if (!botId) return

  const API_URL = script.src.replace('/widget.js', '')

  // ── Fetch bot settings from API ──
  async function init() {
    let settings = {
      bot_name: 'DocBot',
      welcome_message: 'Hello! How can I help you today? 👋',
      primary_color: '#000000',
      fallback_message: 'Sorry, I could not find an answer. Please contact us for help.',
      logo_url: null,
    }

    try {
      const res = await fetch(`${API_URL}/api/bot/settings?botId=${botId}`)
      if (res.ok) {
        const data = await res.json()
        settings = { ...settings, ...data }
      }
    } catch (e) {
      // fallback to defaults
    }

    buildWidget(settings)
  }

  function buildWidget(s) {
    const color = s.primary_color || '#000000'
    const name = s.bot_name || 'DocBot'
    const initial = name[0].toUpperCase()
    const welcomeMsg = s.welcome_message || 'Hello! How can I help you today? 👋'
    const fallbackMsg = s.fallback_message || 'Sorry, I could not find an answer. Please contact us for help.'

    // ── Styles ──
    const style = document.createElement('style')
    style.innerHTML = `
      #docbot-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: ${color};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999;
        box-shadow: 0 4px 24px rgba(0,0,0,0.22);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: none;
        outline: none;
        padding: 6px;
      }
      #docbot-bubble:hover {
        transform: scale(1.07);
        box-shadow: 0 8px 32px rgba(0,0,0,0.28);
      }
      #docbot-bubble-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #22c55e;
        border: 2px solid #fff;
      }
      #docbot-window {
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 370px;
        height: 520px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.14);
        display: none;
        flex-direction: column;
        z-index: 99999;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      #docbot-window.open {
        display: flex;
        opacity: 1;
        transform: translateY(0);
      }
      #docbot-header {
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: ${color};
        flex-shrink: 0;
      }
      #docbot-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        overflow: hidden;
        flex-shrink: 0;
        padding: 2px;
      }
      #docbot-avatar img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      #docbot-header-info { flex: 1; }
      #docbot-header-name {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.2;
      }
      #docbot-header-status {
        color: rgba(255,255,255,0.65);
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 1px;
      }
      #docbot-header-status::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4ade80;
        display: inline-block;
      }
      #docbot-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: background 0.15s;
        line-height: 1;
      }
      #docbot-close:hover { background: rgba(255,255,255,0.15); }
      #docbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }
      #docbot-messages::-webkit-scrollbar { width: 4px; }
      #docbot-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      .docbot-row { display: flex; gap: 8px; align-items: flex-end; }
      .docbot-row.user { flex-direction: row-reverse; }
      .docbot-msg-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        flex-shrink: 0;
        overflow: hidden;
        padding:2px;
      }
      .docbot-msg-avatar img { width: 100%; height: 100%; object-fit: contain; }
      .docbot-msg {
        max-width: 78%;
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.55;
        color: #111;
      }
      .docbot-msg.user {
        background: ${color};
        color: #fff;
        border-bottom-right-radius: 4px;
      }
      .docbot-msg.bot {
        background: #f4f4f5;
        border-bottom-left-radius: 4px;
      }
      .docbot-msg p { margin: 0 0 5px 0; }
      .docbot-msg p:last-child { margin: 0; }
      .docbot-msg ul { margin: 4px 0; padding-left: 18px; }
      .docbot-msg li { margin: 2px 0; }
      .docbot-msg strong { font-weight: 600; }
      .docbot-typing {
        display: flex;
        gap: 4px;
        padding: 12px 14px;
        background: #f4f4f5;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        width: fit-content;
      }
      .docbot-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #9ca3af;
        animation: docbot-bounce 1.2s infinite;
      }
      .docbot-dot:nth-child(2) { animation-delay: 0.2s; }
      .docbot-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes docbot-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
      .docbot-cursor {
        display: inline-block;
        width: 2px;
        height: 13px;
        background: #555;
        margin-left: 2px;
        vertical-align: middle;
        animation: docbot-blink 0.8s infinite;
      }
      @keyframes docbot-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      #docbot-input-area {
        padding: 12px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 8px;
        background: #fff;
        flex-shrink: 0;
      }
      #docbot-input {
        flex: 1;
        padding: 9px 14px;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        font-size: 13.5px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s;
        background: #fafafa;
      }
      #docbot-input:focus { border-color: ${color}; background: #fff; }
      #docbot-send {
        width: 38px;
        height: 38px;
        background: ${color};
        color: #fff;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.15s;
        flex-shrink: 0;
      }
      #docbot-send:hover { opacity: 0.85; }
      #docbot-send:disabled { opacity: 0.35; cursor: not-allowed; }

      @media (max-width: 480px) {
        #docbot-window {
          width: calc(100vw - 24px);
          right: 12px;
          bottom: 80px;
          height: 70vh;
          border-radius: 16px;
        }
        #docbot-bubble { bottom: 16px; right: 12px; }
      }
    `
    document.head.appendChild(style)

    // ── HTML ──
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <button id="docbot-bubble" aria-label="Open chat">
        ${s.logo_url
          ? `<img src="${s.logo_url}" alt="${name}" style="width:100%;height:100%;object-fit:contain;object-position:center;display:block;" />`
          : `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`
        }
        <span id="docbot-bubble-badge"></span>
      </button>
      <div id="docbot-window" role="dialog" aria-label="${name} chat">
        <div id="docbot-header">
          <div id="docbot-avatar">
            ${s.logo_url ? `<img src="${s.logo_url}" alt="${name}" />` : initial}
          </div>
          <div id="docbot-header-info">
            <div id="docbot-header-name">${name}</div>
            <div id="docbot-header-status">Online</div>
          </div>
          <button id="docbot-close" aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="docbot-messages">
          <div class="docbot-row">
            <div class="docbot-msg-avatar">
              ${s.logo_url ? `<img src="${s.logo_url}" alt="${name}" />` : initial}
            </div>
            <div class="docbot-msg bot">${welcomeMsg}</div>
          </div>
        </div>
        <div id="docbot-input-area">
          <input id="docbot-input" type="text" placeholder="Ask a question..." autocomplete="off" />
          <button id="docbot-send" disabled aria-label="Send">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `
    document.body.appendChild(wrapper)

    const bubble = document.getElementById('docbot-bubble')
    const win = document.getElementById('docbot-window')
    const messagesEl = document.getElementById('docbot-messages')
    const inputEl = document.getElementById('docbot-input')
    const sendBtn = document.getElementById('docbot-send')
    const closeBtn = document.getElementById('docbot-close')

    // Enable send when input has value
    inputEl.addEventListener('input', function () {
      sendBtn.disabled = !this.value.trim()
    })

    bubble.onclick = function () { win.classList.toggle('open') }
    closeBtn.onclick = function () { win.classList.remove('open') }

    // Markdown parser
    function parseMarkdown(text) {
      const lines = text.split('\n')
      let html = ''
      let inList = false
      lines.forEach(function (line) {
        const t = line.trim()
        if (t.startsWith('* ') || t.startsWith('- ')) {
          if (!inList) { html += '<ul>'; inList = true }
          html += '<li>' + fmt(t.slice(2)) + '</li>'
        } else {
          if (inList) { html += '</ul>'; inList = false }
          if (t) html += '<p>' + fmt(t) + '</p>'
        }
      })
      if (inList) html += '</ul>'
      return html
    }

    function fmt(text) {
      return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    }

    // Word by word typing
    function typeMessage(el, text) {
      const words = text.split(' ')
      let i = 0
      el.innerHTML = ''
      const cursor = document.createElement('span')
      cursor.className = 'docbot-cursor'
      el.appendChild(cursor)

      const interval = setInterval(function () {
        if (i < words.length) {
          cursor.before(document.createTextNode((i === 0 ? '' : ' ') + words[i]))
          messagesEl.scrollTop = messagesEl.scrollHeight
          i++
        } else {
          clearInterval(interval)
          cursor.remove()
          el.innerHTML = parseMarkdown(text)
          messagesEl.scrollTop = messagesEl.scrollHeight
        }
      }, 50)
    }

    // Send message
    async function sendMessage() {
      const question = inputEl.value.trim()
      if (!question) return

      sendBtn.disabled = true
      inputEl.value = ''

      // User message
      const userRow = document.createElement('div')
      userRow.className = 'docbot-row user'
      userRow.innerHTML = `<div class="docbot-msg user">${question}</div>`
      messagesEl.appendChild(userRow)
      messagesEl.scrollTop = messagesEl.scrollHeight

      // Typing dots
      const typingRow = document.createElement('div')
      typingRow.className = 'docbot-row'
      typingRow.id = 'docbot-typing'
      typingRow.innerHTML = `
        <div class="docbot-msg-avatar">${s.logo_url ? `<img src="${s.logo_url}" />` : initial}</div>
        <div class="docbot-typing">
          <div class="docbot-dot"></div>
          <div class="docbot-dot"></div>
          <div class="docbot-dot"></div>
        </div>
      `
      messagesEl.appendChild(typingRow)
      messagesEl.scrollTop = messagesEl.scrollHeight

      try {
        const res = await fetch(API_URL + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId, question })
        })
        const data = await res.json()

        const typing = document.getElementById('docbot-typing')
        if (typing) typing.remove()

        const answer = data.answer || fallbackMsg

        const botRow = document.createElement('div')
        botRow.className = 'docbot-row'
        const avatar = document.createElement('div')
        avatar.className = 'docbot-msg-avatar'
        avatar.innerHTML = s.logo_url ? `<img src="${s.logo_url}" />` : initial
        const botMsg = document.createElement('div')
        botMsg.className = 'docbot-msg bot'
        botRow.appendChild(avatar)
        botRow.appendChild(botMsg)
        messagesEl.appendChild(botRow)

        typeMessage(botMsg, answer)

      } catch (err) {
        const typing = document.getElementById('docbot-typing')
        if (typing) typing.remove()

        const errRow = document.createElement('div')
        errRow.className = 'docbot-row'
        errRow.innerHTML = `
          <div class="docbot-msg-avatar">${s.logo_url ? `<img src="${s.logo_url}" />` : initial}</div>
          <div class="docbot-msg bot">${fallbackMsg}</div>
        `
        messagesEl.appendChild(errRow)
      }
    }

    sendBtn.onclick = sendMessage
    inputEl.onkeydown = function (e) {
      if (e.key === 'Enter' && !sendBtn.disabled) sendMessage()
    }
  }

  init()
})()