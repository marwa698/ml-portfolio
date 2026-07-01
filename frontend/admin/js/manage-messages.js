requireAdminAuth();
renderAdminSidebar('messages');

let messagesCache = [];
let currentMessageId = null;

async function loadMessages() {
  try {
    messagesCache = await adminApiRequest('/messages');
    renderMessagesTable(messagesCache);
  } catch (e) {
    showAdminToast('Failed to load messages', 'error');
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messages-table-body');
  if (!messages.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">No messages yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = messages.map((m) => `
    <tr class="${!m.isRead ? 'message-row unread' : 'message-row'}">
      <td class="admin-row-title">${m.name}</td>
      <td>${m.subject}</td>
      <td>${new Date(m.createdAt).toLocaleDateString()}</td>
      <td>${m.isRead
        ? '<span class="admin-badge admin-badge-published">Read</span>'
        : '<span class="admin-badge admin-badge-unread">New</span>'}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openMessage('${m._id}')" aria-label="View"><i class="fa-solid fa-eye"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteMessage('${m._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

const msgModal = document.getElementById('message-modal');

function openMessage(id) {
  const msg = messagesCache.find((m) => m._id === id);
  if (!msg) return;
  currentMessageId = id;
  document.getElementById('message-modal-subject').textContent = msg.subject;
  document.getElementById('message-modal-from').textContent = msg.name;
  document.getElementById('message-modal-email').textContent = msg.email;
  document.getElementById('message-modal-body').textContent = msg.body;
  msgModal.classList.add('show');

  // نعلم الرسالة كمقروءة لو لسه جديدة
  if (!msg.isRead) {
    adminApiRequest(`/messages/${id}/read`, { method: 'PUT' }).then(() => {
      msg.isRead = true;
      renderMessagesTable(messagesCache);
      updateUnreadBadge();
    }).catch(() => {});
  }
}

function closeMessageModal() {
  msgModal.classList.remove('show');
  currentMessageId = null;
}

document.getElementById('message-modal-close').addEventListener('click', closeMessageModal);
document.getElementById('message-modal-close-btn').addEventListener('click', closeMessageModal);

document.getElementById('message-delete-btn').addEventListener('click', async function () {
  if (!currentMessageId) return;
  await deleteMessage(currentMessageId);
  closeMessageModal();
});

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await adminApiRequest(`/messages/${id}`, { method: 'DELETE' });
    showAdminToast('Message deleted');
    loadMessages();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadMessages();