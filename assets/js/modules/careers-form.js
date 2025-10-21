export function initCareersForm() {
  const careerForm = document.getElementById('careerForm');
  if (!careerForm) return;

  careerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('full_name', document.getElementById('full-name').value);
    formData.append('email', document.getElementById('career-email').value);
    formData.append('phone', document.getElementById('career-phone').value);
    formData.append('country', document.getElementById('career-country').value);
    formData.append('city', document.getElementById('career-city').value);
    formData.append('position', document.getElementById('position').value);
    formData.append('cover_letter', document.getElementById('message').value);
    
    // Add files
    formData.append('cv-input', document.getElementById('cv-input').files[0]);
    formData.append('id-input', document.getElementById('id-input').files[0]);
    
    try {
      const response = await fetch('/submit_application', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.success);
        this.reset();
        document.querySelectorAll('.file-info').forEach(el => {
          el.style.display = 'none';
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });

  function setupFileUpload(inputId, infoId) {
    const input = document.getElementById(inputId);
    const info = document.getElementById(infoId);
    
    if (!input || !info) return;
    
    input.addEventListener('change', function() {
      if (this.files.length > 0) {
        const file = this.files[0];
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2) + 'MB';
        
        info.querySelector('.file-name').textContent = fileName;
        info.querySelector('.file-size').textContent = fileSize;
        info.style.display = 'block';
      }
    });
  }

  setupFileUpload('cv-input', 'cv-info');
  setupFileUpload('id-input', 'id-info');
}