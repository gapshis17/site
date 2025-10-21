
function calculateShipping() {
  
    const fromCountry = document.getElementById('from-country').value;
    const toCountry = document.getElementById('to-country').value;
    const cargoType = document.getElementById('cargo-type').value;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const insurance = document.getElementById('insurance').checked;
    const packaging = document.getElementById('packaging').checked;
    const doorDelivery = document.getElementById('door-delivery').checked;
    
  
    const basePrices = {
        documents: 35,
        parcel: 100,
        pallet: 500,
        fragile: 150,
        oversize: 400
    };
    
   
    let basePrice = basePrices[cargoType] || 100;
    

    basePrice += weight * 0.8;
    
    
    const isIntercontinental = (fromCountry === 'usa' && toCountry !== 'usa') || 
                              (toCountry === 'usa' && fromCountry !== 'usa');
    
    if (isIntercontinental) {
        basePrice *= 1.5; 
    }
    
    
    let additionalCost = 0;
    if (insurance) additionalCost += basePrice * 0.015;
    if (packaging) additionalCost += 15;
    if (doorDelivery) additionalCost += 45;
    
    
    const totalCost = basePrice + additionalCost;
    
    
    let deliveryDays;
    if (fromCountry === toCountry) {
        deliveryDays = "2-4 days";
    } else if (isIntercontinental) {
        deliveryDays = "5-8 days";
    } else {
        deliveryDays = "3-5 days";
    }
    
    
    document.getElementById('baseCost').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('additionalCost').textContent = `$${additionalCost.toFixed(2)}`;
    document.getElementById('deliveryTime').textContent = deliveryDays;
    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    
   
    document.getElementById('resultContainer').style.display = 'block';
}


export function initCalculator() {
    document.getElementById('calculateBtn').addEventListener('click', calculateShipping);
}