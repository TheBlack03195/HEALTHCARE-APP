// ===== TAB SWITCHING =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ===== RANGE INPUT =====
const hoursRange = document.getElementById('hours-range');
const hoursLabel = document.getElementById('hours-label');
if (hoursRange) {
  hoursRange.addEventListener('input', () => {
    hoursLabel.textContent = hoursRange.value + ' hrs/week';
  });
}

// ===== FORM SUBMISSIONS =====
function showModal(title, body) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal-overlay').classList.add('active');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

document.getElementById('patient-form').addEventListener('submit', e => {
  e.preventDefault();
  showModal('Request Submitted! ✓', 'Thank you for reaching out. Our support team will contact you within 24 hours at your preferred time.');
  e.target.reset();
});

document.getElementById('volunteer-form').addEventListener('submit', e => {
  e.preventDefault();
  showModal('Welcome, Volunteer! 🤝', 'Your registration has been received. We\'ll send onboarding details to your email shortly.');
  e.target.reset();
  if (hoursLabel) hoursLabel.textContent = '5 hrs/week';
});

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  showModal('Message Sent! ✉', 'We\'ve received your message and will get back to you within 2 business days.');
  e.target.reset();
});


const DEV_API_KEY = 'YOUR_GROQ_API_KEY'; 

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable AI assistant for MedCare Connect, a non-profit healthcare NGO serving communities in Assam and Northeast India.

Your role is to:
1. Answer questions about MedCare Connect's services (free medical consultations, mental health support, medication assistance, home nursing care, diagnostics, community outreach)
2. Guide patients on how to register for support via the registration form on the website
3. Guide volunteers on how to join the initiative
4. Provide general, non-diagnostic health information (remind users to always consult a doctor)
5. Handle medical emergency queries by urging them to call 108 (India's emergency number) immediately
6. Explain NGO use cases and how the organization helps underserved communities

Keep responses concise (2-5 sentences), warm, and helpful. Use simple language. Never provide specific diagnoses or prescriptions. Always recommend professional medical advice for health concerns.`;

let conversationHistory = [];
let isLoading = false;

function addMessage(role, content) {
  const chatWindow = document.getElementById('chat-window');
  const msgEl = document.createElement('div');
  msgEl.classList.add('chat-message', role);
  const avatar = document.createElement('div');
  avatar.classList.add('avatar', role === 'bot' ? 'bot-avatar' : 'user-avatar');
  avatar.textContent = role === 'bot' ? '✦' : 'You';
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerHTML = content.replace(/\n/g, '<br/>');
  msgEl.appendChild(avatar);
  msgEl.appendChild(bubble);
  chatWindow.appendChild(msgEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgEl;
}

function showTyping() {
  const chatWindow = document.getElementById('chat-window');
  const msgEl = document.createElement('div');
  msgEl.classList.add('chat-message', 'bot');
  msgEl.id = 'typing-indicator';
  const avatar = document.createElement('div');
  avatar.classList.add('avatar', 'bot-avatar');
  avatar.textContent = '✦';
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  msgEl.appendChild(avatar);
  msgEl.appendChild(bubble);
  chatWindow.appendChild(msgEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const text = input.value.trim();
  if (!text || isLoading) return;

  addMessage('user', text);
  input.value = '';
  conversationHistory.push({ role: 'user', content: text });

  isLoading = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    let reply = null;

    
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';

    if (isLocal) {
  
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEV_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content
            }))
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Groq error:', data);
        throw new Error(data?.error?.message || 'Groq API error');
      }
      reply = data?.choices?.[0]?.message?.content || null;

    } else {

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: conversationHistory,
          systemPrompt: SYSTEM_PROMPT
        })
      });
      const data = await res.json();
 
      if (data.error || data.geminiError) {
        removeTyping();
        addMessage('bot', 'Error: ' + (data.geminiError || data.error || data.detail || JSON.stringify(data)));
        isLoading = false;
        sendBtn.disabled = false;
        return;
      }
      reply = data.reply || null;
    }

    removeTyping();

    if (reply) {
      conversationHistory.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);
    } else {
      addMessage('bot', 'I\'m sorry, I encountered an issue. Please try again or call us directly.');
    }

  } catch (err) {
    removeTyping();
    addMessage('bot', 'I\'m having trouble connecting right now. Please try again in a moment, or contact us directly.');
    console.error('API error:', err);
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
  }
}

function sendSuggestion(btn) {
  const text = btn.textContent;
  document.getElementById('chat-input').value = text;
  btn.closest('.chat-suggestions').style.display = 'none';
  sendMessage();
}


document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});