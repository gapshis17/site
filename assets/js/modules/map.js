const offices = [
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "Frankfurt", lat: 50.1109, lon: 8.6821 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Stockholm", lat: 59.3293, lon: 18.0686 }
];


export function initMap() {
    const map = L.map('map').setView([48.8566, 2.3522], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
   
    offices.forEach(office => {
        const marker = L.marker([office.lat, office.lon]).addTo(map);
        marker.bindPopup(`<b>${office.name} Office</b><br>SwiftWay Logistics`);
    });
    
   
    const serviceArea = L.layerGroup().addTo(map);
    
  
    const europe = L.polygon([
        [35.0, -10.0],
        [35.0, 40.0],
        [70.0, 40.0],
        [70.0, -10.0]
    ], {color: 'blue', fillOpacity: 0.1, weight: 1}).addTo(serviceArea);
    
    const northAmerica = L.polygon([
        [15.0, -170.0],
        [15.0, -50.0],
        [70.0, -50.0],
        [70.0, -170.0]
    ], {color: 'red', fillOpacity: 0.1, weight: 1}).addTo(serviceArea);
    

    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.innerHTML = '<h4>Service Areas</h4>' +
                        '<div><i style="background:blue; width: 15px; height: 15px; display: inline-block; opacity: 0.5"></i> Europe</div>' +
                        '<div><i style="background:red; width: 15px; height: 15px; display: inline-block; opacity: 0.5"></i> North America</div>';
        return div;
    };
    legend.addTo(map);
}