// modules/careers.js


function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function initFileUploaders() {
    
    const cvUploadArea = document.getElementById('cv-upload-area');
    if (!cvUploadArea) return;

    const cvInput = document.getElementById('cv-input');
    const cvInfo = document.getElementById('cv-info');
    const cvFileName = cvInfo.querySelector('.file-name');
    const cvFileSize = cvInfo.querySelector('.file-size');
    
    cvInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            cvFileName.textContent = file.name;
            cvFileSize.textContent = formatFileSize(file.size);
            cvInfo.style.display = 'block';
            cvUploadArea.classList.add('active');
            
          
            const fileIcon = cvInfo.querySelector('i');
            if (file.type === 'application/pdf') {
                fileIcon.className = 'fas fa-file-pdf';
            } else if (file.type.includes('image')) {
                fileIcon.className = 'fas fa-file-image';
            }
            
           
            setTimeout(() => {
                cvUploadArea.classList.remove('active');
            }, 1000);
        }
    });
    
    
    const idInput = document.getElementById('id-input');
    const idUploadArea = document.getElementById('id-upload-area');
    const idInfo = document.getElementById('id-info');
    const idFileName = idInfo.querySelector('.file-name');
    const idFileSize = idInfo.querySelector('.file-size');
    
    idInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            idFileName.textContent = file.name;
            idFileSize.textContent = formatFileSize(file.size);
            idInfo.style.display = 'block';
            idUploadArea.classList.add('active');
            
           
            const fileIcon = idInfo.querySelector('i');
            if (file.type === 'application/pdf') {
                fileIcon.className = 'fas fa-file-pdf';
            } else if (file.type.includes('image')) {
                fileIcon.className = 'fas fa-file-image';
            }
            
            
            setTimeout(() => {
                idUploadArea.classList.remove('active');
            }, 1000);
        }
    });
    
    
    [cvUploadArea, idUploadArea].forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('active');
        });
        
        area.addEventListener('dragleave', function() {
            this.classList.remove('active');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('active');
            
            const input = this.querySelector('.file-input');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                input.files = e.dataTransfer.files;
                const event = new Event('change');
                input.dispatchEvent(event);
            }
        });
    });
}