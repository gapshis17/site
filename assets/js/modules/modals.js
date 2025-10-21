
function setupModal(openBtnId, modalId, closeBtnId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    
    if (!openBtn || !modal || !closeBtn) return;
    
    openBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

export function initModals() {
    setupModal('callbackBtn', 'callbackModal', 'closeCallback');
    setupModal('privacyLink', 'privacyModal', 'closePrivacy');
}