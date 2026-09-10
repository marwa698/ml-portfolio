// لو المستخدم جاي من زرار خدمة معينة في قسم Services (contact.html?service=...)
// نملّي حقلي الموضوع والرسالة تلقائيًا عشان يوضح إنه مهتم بالخدمة دي

function prefillContactFromService() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (!service) return;

  const subjectInput = document.querySelector('#contact-form input[name="subject"]');
  const messageInput = document.querySelector('#contact-form textarea[name="body"]');

  if (subjectInput && !subjectInput.value) {
    subjectInput.value = `Interested in: ${service}`;
  }
  if (messageInput && !messageInput.value) {
    messageInput.value = `Hi Marwa, I'm interested in your ${service} service. I'd like to talk about my project.`;
  }
}

document.addEventListener('DOMContentLoaded', prefillContactFromService);