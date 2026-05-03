// Add Whats app icon in the bottom right corner 
const whatsappLink = document.createElement('a');
whatsappLink.href = 'https://wa.me/94769049233'; // Replace with your WhatsApp number
whatsappLink.target = '_blank';

// Add message content box
const messageBox = document.createElement('div');
messageBox.classList.add('message-box', 'fixed', 'bottom-20', 'right-6', 'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'hidden', 'z-50', 'transition-opacity', 'duration-300');

const messageInput = document.createElement('input');
messageInput.type = 'text';
messageInput.placeholder = 'Type your message...';
messageInput.value = `Hello! Can I get more info on this?`;
messageInput.classList.add('w-full', 'p-2', 'border', 'border-gray-300', 'rounded');

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
sendButton.classList.add('mt-2', 'w-full', 'bg-green-500', 'text-white', 'p-2', 'rounded');

messageBox.appendChild(messageInput);
messageBox.appendChild(sendButton);
document.body.appendChild(messageBox);

// Show message box on WhatsApp icon click
whatsappLink.addEventListener('click', (e) => {
    e.preventDefault();
    messageBox.classList.toggle('hidden');
});
whatsappLink.classList.add('whatsapp-link');

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const phone = "94769049233"; // Sri Lanka number (no +)
    const pageURL = window.location.href;
    if (message) {
        const fullMessage = `${message}\n\n${pageURL}`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
        window.open(url, "_blank");
        messageInput.value = '';
        messageBox.classList.add('hidden');
    }
});

const whatsappIcon = document.createElement('i');

// Add Font Awesome classes
whatsappIcon.classList.add(
  'fa-brands',
  'fa-whatsapp',
  'fixed',
  'bottom-6',
  'right-6',
  'cursor-pointer',
  'z-50',
  'text-4xl',
  'transition-transform',
  'duration-300',
  'hover:scale-110'
);

// Set color
whatsappIcon.style.color = 'rgb(28, 209, 78)';

whatsappLink.appendChild(whatsappIcon);
document.body.appendChild(whatsappLink);
// send message commit 
