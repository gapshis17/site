

export const cities = {
    usa: ["New York", "Chicago", "Los Angeles", "Miami", "Houston"],
    germany: ["Frankfurt", "Berlin", "Munich", "Hamburg", "Cologne"],
    france: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    uk: ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow"],
    sweden: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås"]
};


export function setupCountryCityDropdown(countryId, cityId) {
    const countrySelect = document.getElementById(countryId);
    const citySelect = document.getElementById(cityId);
    
    if (!countrySelect || !citySelect) return;
    
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        citySelect.innerHTML = '<option value="">Select City</option>';
        citySelect.disabled = true;
        
        if (selectedCountry && cities[selectedCountry]) {
            cities[selectedCountry].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase().replace(/\s+/g, '-');
                option.textContent = city;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        }
    });
}

export function setupCitySelector() {
    const citySelectorBtn = document.querySelector('.city-selector-btn');
    const cityDropdown = document.querySelector('.city-dropdown');
    const cityItems = document.querySelectorAll('.city-item');
    
    if (!citySelectorBtn || !cityDropdown) return;
    
    citySelectorBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cityDropdown.classList.toggle('active');
    });
    
    cityItems.forEach(item => {
        item.addEventListener('click', function() {
            citySelectorBtn.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${this.textContent} <i class="fas fa-chevron-down"></i>`;
            cityDropdown.classList.remove('active');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!cityDropdown.contains(e.target) && !citySelectorBtn.contains(e.target)) {
            cityDropdown.classList.remove('active');
        }
    });
}