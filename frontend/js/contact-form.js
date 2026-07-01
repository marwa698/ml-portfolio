// التعامل مع إرسال نموذج التواصل (الموجود في الصفحة الرئيسية و contact.html)

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const alertBox = document.getElementById('contact-alert');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      subject: form.querySelector('[name="subject"]').value.trim(),
      body: form.querySelector('[name="body"]').value.trim(),
    };

    // تعطيل الزرار مؤقتاً عشان نمنع إرسال مكرر
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    const result = await sendContactMessage(formData);

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    showAlert(result.success, result.success ? result.data.message : result.message);

    if (result.success) {
      form.reset();
    }
  });

  function showAlert(success, message) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert show ${success ? 'alert-success' : 'alert-error'}`;

    setTimeout(function () {
      alertBox.classList.remove('show');
    }, 5000);
  }
});