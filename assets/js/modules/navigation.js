
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    
    if (!mobileMenuBtn || !mainMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        mainMenu.classList.toggle('active');
    });
}


function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                
                if (window.innerWidth <= 768) {
                    document.getElementById('mainMenu').classList.remove('active');
                }
            }
        });
    });
}


export function initNavigation() {
    initMobileMenu();
    initSmoothScrolling();
}