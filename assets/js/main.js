// main.js
import { initMap } from './modules/map.js';
import { setupCountryCityDropdown, setupCitySelector } from './modules/dropdowns.js';
import { initModals } from './modules/modals.js';
import { initCalculator } from './modules/calculator.js';
import { initNavigation } from './modules/navigation.js';
import { initFileUploaders } from './modules/careers.js';
import { initCareersForm } from './modules/careers-form.js';

if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map')) initMap();
    setupCitySelector();
    setupCountryCityDropdown('from-country', 'from-city');
    setupCountryCityDropdown('to-country', 'to-city');
    setupCountryCityDropdown('career-country', 'career-city');
    initModals();
    initCalculator();
    initNavigation();
    initFileUploaders();
    initCareersForm();
});