const MessagesPage = {
  activeChatId: null,
  conversations: [],

  init: () => {
    Layout.renderPatientLayout('messages');
    
    MessagesPage.loadConversations();
    MessagesPage.renderContactList();
    
    // Automatically open the first conversation if on desktop
    if (window.innerWidth > 800 && MessagesPage.conversations.length > 0) {
      MessagesPage.selectChat(MessagesPage.conversations[0].id);
    }
  },

  loadConversations: () => {
    const saved = localStorage.getItem('mock_messages_v1');
    if (saved) {
      MessagesPage.conversations = JSON.parse(saved);
    } else {
      // Seed default conversations
      MessagesPage.conversations = [
        {
          id: 'chat_1',
          contactName: 'Dr. Jenkins',
          role: 'General Practitioner',
          messages: [
            { id: 'm1', text: "Hello, I have reviewed your recent blood test results. Everything looks normal.", sender: 'them', timestamp: "10:30 AM" },
            { id: 'm2', text: "That's a relief! Thank you Dr. Jenkins.", sender: 'me', timestamp: "10:35 AM" }
          ]
        },
        {
          id: 'chat_2',
          contactName: 'Riverside Administration',
          role: 'Clinic Staff',
          messages: [
            { id: 'm1', text: "Reminder: Your appointment is scheduled for tomorrow at 9:00 AM.", sender: 'them', timestamp: "Yesterday" }
          ]
        }
      ];
      MessagesPage.saveConversations();
    }
  },

  saveConversations: () => {
    localStorage.setItem('mock_messages_v1', JSON.stringify(MessagesPage.conversations));
  },

  renderContactList: () => {
    const list = document.getElementById('contactList');
    list.innerHTML = MessagesPage.conversations.map(chat => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      const initials = chat.contactName.split(' ').map(n=>n[0]).join('').substring(0,2);
      const isActive = chat.id === MessagesPage.activeChatId ? 'active' : '';

      return `
        <div class="contact-item ${isActive}" onclick="MessagesPage.selectChat('${chat.id}')">
          <div class="contact-avatar">${initials}</div>
          <div class="contact-info">
            <div class="contact-name">${chat.contactName}</div>
            <div class="contact-preview">${lastMessage ? lastMessage.text : 'No messages yet'}</div>
          </div>
        </div>
      `;
    }).join("");
    
    if (window.lucide) lucide.createIcons();
  },

  selectChat: (chatId) => {
    MessagesPage.activeChatId = chatId;
    MessagesPage.renderContactList(); // Re-render to show active state
    MessagesPage.renderChatArea();
  },

  handleSendMessage: (e) => {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text || !MessagesPage.activeChatId) return;

    const chatIndex = MessagesPage.conversations.findIndex(c => c.id === MessagesPage.activeChatId);
    if (chatIndex > -1) {
      const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      MessagesPage.conversations[chatIndex].messages.push({
        id: 'm_' + Date.now(),
        text: text,
        sender: 'me',
        timestamp: timeStr
      });
      
      MessagesPage.saveConversations();
      input.value = '';
      
      // Update UI
      MessagesPage.renderContactList();
      MessagesPage.renderChatArea();
    }
  },

  renderChatArea: () => {
    const main = document.getElementById('chatMain');
    const chat = MessagesPage.conversations.find(c => c.id === MessagesPage.activeChatId);
    
    if (!chat) return;

    const initials = chat.contactName.split(' ').map(n=>n[0]).join('').substring(0,2);

    const messagesHtml = chat.messages.map(m => {
      const isMe = m.sender === 'me';
      return `
        <div class="message-bubble ${isMe ? 'sent' : 'received'}">
          ${m.text}
          <span class="message-time">${m.timestamp}</span>
        </div>
      `;
    }).join('');

    main.innerHTML = `
      <div class="chat-main-header">
        <div class="contact-avatar" style="width:40px; height:40px; font-size:14px;">${initials}</div>
        <div>
          <h3 style="font-weight: 700; font-size: 16px;">${chat.contactName}</h3>
          <p style="color: var(--text-muted); font-size: 13px;">${chat.role}</p>
        </div>
      </div>
      <div class="chat-messages" id="chatMessagesBox">
        ${messagesHtml}
      </div>
      <form class="chat-input-area" id="chatInputForm">
        <input type="text" id="messageInput" placeholder="Type a secure message..." autocomplete="off" />
        <button type="submit" class="btn btn-primary" style="padding: 14px; border-radius: 50%;">
          <i data-lucide="send" style="width: 18px; height: 18px; margin-left: -2px;"></i>
        </button>
      </form>
    `;

    // Handle form submit
    document.getElementById('chatInputForm').addEventListener('submit', MessagesPage.handleSendMessage);

    // Scroll to bottom
    const box = document.getElementById('chatMessagesBox');
    box.scrollTop = box.scrollHeight;
    
    if (window.lucide) lucide.createIcons();
  }
};

document.addEventListener("DOMContentLoaded", MessagesPage.init);
