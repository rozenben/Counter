let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function addItem(cabinet, shelf, count) {
    cabinet = parseInt(cabinet);
    shelf = parseInt(shelf);
    count = parseInt(count);
    const existingItem = inventory.find(item => item.cabinet === cabinet && item.shelf === shelf);
    if (existingItem) {
        existingItem.count += count;
    } else {
        inventory.push({ cabinet, shelf, count });
    }
    inventory.sort((a, b) => a.cabinet - b.cabinet || a.shelf - b.shelf);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
}

function displayInventory() {
    const display = document.getElementById('inventoryDisplay');
    display.innerHTML = '';
    let currentCabinet = null;
    let cabinetElement = null;
    let cabinetTotal = 0;
    let grandTotal = 0;

    inventory.forEach(item => {
        if (item.cabinet !== currentCabinet) {
            if (cabinetElement) {
                cabinetElement.innerHTML += <div class="total">סה"כ בארון: ${cabinetTotal}</div>;
                cabinetTotal = 0;
            }
            currentCabinet = item.cabinet;
            cabinetElement = document.createElement('div');
            cabinetElement.className = 'cabinet';
            cabinetElement.innerHTML = <h2>ארון ${item.cabinet}</h2>;
            display.appendChild(cabinetElement);
        }
        const shelfElement = document.createElement('div');
        shelfElement.className = 'shelf';
        shelfElement.textContent = מדף ${item.shelf}: ${item.count} פריטים;
        cabinetElement.appendChild(shelfElement);
        cabinetTotal += item.count;
        grandTotal += item.count;
    });

    if (cabinetElement) {
        cabinetElement.innerHTML += <div class="total">סה"כ בארון: ${cabinetTotal}</div>;
    }
    
    const grandTotalElement = document.createElement('div');
    grandTotalElement.className = 'total';
    grandTotalElement.textContent = סה"כ כללי: ${grandTotal};
    display.appendChild(grandTotalElement);
}

document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cabinet = document.getElementById('cabinetNumber').value;
    const shelf = document.getElementById('shelfNumber').value;
    const count = document.getElementById('itemCount').value;
    addItem(cabinet, shelf, count);
    this.reset();
});

displayInventory();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log('Service worker registered', reg))
    .catch((err) => console.log('Service worker not registered', err));
}