const whatsappPhoneNumber = '94764823793';
const defaultWhatsAppMessage = 'Hello! I would like to know more about your job opportunities.';
const previewPageUrl = window.location.href.startsWith('http')
    ? window.location.href
    : 'https://pearlstone.lk/';

const widgetStyle = document.createElement('style');
widgetStyle.textContent = `
    .whatsapp-widget {
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        z-index: 60;
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
    }

    .whatsapp-tooltip {
        background: rgba(15, 23, 42, 0.96);
        color: #fff;
        padding: 0.7rem 0.95rem;
        border-radius: 999px;
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
        opacity: 0;
        transform: translateX(8px) scale(0.98);
        transition: opacity 180ms ease, transform 180ms ease;
        pointer-events: none;
        white-space: nowrap;
    }

    .whatsapp-widget:hover .whatsapp-tooltip,
    .whatsapp-widget:focus-within .whatsapp-tooltip {
        opacity: 1;
        transform: translateX(0) scale(1);
    }

    .whatsapp-button {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        color: #fff;
        box-shadow: 0 18px 35px rgba(37, 211, 102, 0.35);
        border: 0;
        cursor: pointer;
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
        position: relative;
    }

    .whatsapp-button:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 22px 42px rgba(37, 211, 102, 0.45);
        filter: brightness(1.02);
    }

    .whatsapp-button::before {
        content: '';
        position: absolute;
        inset: -0.35rem;
        border-radius: inherit;
        border: 1px solid rgba(37, 211, 102, 0.22);
        animation: whatsapp-pulse 2.2s ease-out infinite;
    }

    .whatsapp-button i {
        font-size: 1.9rem;
        line-height: 1;
    }

    .whatsapp-panel {
        position: fixed;
        right: 1.5rem;
        bottom: 5.75rem;
        width: min(22rem, calc(100vw - 3rem));
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 1.25rem;
        box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
        overflow: hidden;
        z-index: 60;
        transform-origin: bottom right;
        transition: opacity 180ms ease, transform 180ms ease;
    }

    .whatsapp-panel.hidden-panel {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
        pointer-events: none;
    }

    .whatsapp-panel-header {
        background: linear-gradient(135deg, #172554 0%, #2563eb 100%);
        color: #fff;
        padding: 1rem 1rem 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .whatsapp-panel-body {
        padding: 1rem;
    }

    .whatsapp-panel-body p {
        color: #475569;
        font-size: 0.92rem;
        line-height: 1.55;
        margin-bottom: 0.85rem;
    }

    .whatsapp-input {
        width: 100%;
        min-height: 6rem;
        resize: vertical;
        border-radius: 0.9rem;
        border: 1px solid #cbd5e1;
        padding: 0.85rem 0.95rem;
        font: inherit;
        outline: none;
        transition: border-color 180ms ease, box-shadow 180ms ease;
    }

    .whatsapp-input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .whatsapp-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-top: 0.9rem;
    }

    .whatsapp-send,
    .whatsapp-close {
        border: 0;
        border-radius: 999px;
        padding: 0.82rem 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 180ms ease, opacity 180ms ease;
    }

    .whatsapp-send {
        background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        color: #fff;
    }

    .whatsapp-close {
        background: #e2e8f0;
        color: #0f172a;
    }

    .whatsapp-send:hover,
    .whatsapp-close:hover {
        transform: translateY(-1px);
    }

    @keyframes whatsapp-pulse {
        0% {
            transform: scale(0.92);
            opacity: 0.9;
        }
        70% {
            transform: scale(1.08);
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    @media (max-width: 640px) {
        .whatsapp-widget {
            right: 1rem;
            bottom: 1rem;
        }

        .whatsapp-tooltip {
            display: none;
        }

        .whatsapp-panel {
            right: 1rem;
            bottom: 5.25rem;
            width: calc(100vw - 2rem);
        }
    }
`;
document.head.appendChild(widgetStyle);

const whatsappWidget = document.createElement('div');
whatsappWidget.className = 'whatsapp-widget';

const whatsappTooltip = document.createElement('span');
whatsappTooltip.className = 'whatsapp-tooltip';
whatsappTooltip.textContent = 'Chat with us';

const whatsappButton = document.createElement('button');
whatsappButton.type = 'button';
whatsappButton.className = 'whatsapp-button';
whatsappButton.setAttribute('aria-label', 'Chat with us on WhatsApp');
whatsappButton.title = 'Chat with us';
whatsappButton.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';

const whatsappPanel = document.createElement('div');
whatsappPanel.className = 'whatsapp-panel hidden-panel';

const panelHeader = document.createElement('div');
panelHeader.className = 'whatsapp-panel-header';
panelHeader.innerHTML = `
    <div>
        <div style="font-size: 1rem; font-weight: 700;">Pearl Stone Support</div>
        <div style="font-size: 0.82rem; opacity: 0.9;">Usually replies in a few minutes</div>
    </div>
`;

const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.className = 'whatsapp-close';
closeButton.textContent = 'Close';

const panelBody = document.createElement('div');
panelBody.className = 'whatsapp-panel-body';

const panelText = document.createElement('p');
panelText.textContent = 'Send us a quick message and we will continue the conversation on WhatsApp.';

const messageInput = document.createElement('textarea');
messageInput.className = 'whatsapp-input';
messageInput.placeholder = 'Type your message...';
messageInput.value = defaultWhatsAppMessage;

const actionRow = document.createElement('div');
actionRow.className = 'whatsapp-actions';

const sendButton = document.createElement('button');
sendButton.type = 'button';
sendButton.className = 'whatsapp-send';
sendButton.textContent = 'Send Message';

const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.className = 'whatsapp-close';
resetButton.textContent = 'Reset';

actionRow.appendChild(sendButton);
actionRow.appendChild(resetButton);
panelBody.appendChild(panelText);
panelBody.appendChild(messageInput);
panelBody.appendChild(actionRow);

whatsappPanel.appendChild(panelHeader);
whatsappPanel.appendChild(panelBody);

whatsappWidget.appendChild(whatsappTooltip);
whatsappWidget.appendChild(whatsappButton);

document.body.appendChild(whatsappPanel);
document.body.appendChild(whatsappWidget);

const openWhatsAppChat = () => {
        const message = messageInput.value.trim();
        if (!message) {
                return;
        }

    const finalMessage = `${message}\n\n${previewPageUrl}`;
        const url = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        whatsappPanel.classList.add('hidden-panel');
};

whatsappButton.addEventListener('click', () => {
        whatsappPanel.classList.toggle('hidden-panel');
});

closeButton.addEventListener('click', () => {
        whatsappPanel.classList.add('hidden-panel');
});

resetButton.addEventListener('click', () => {
        messageInput.value = defaultWhatsAppMessage;
});

sendButton.addEventListener('click', openWhatsAppChat);

panelHeader.appendChild(closeButton);

