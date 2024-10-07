let inventory = JSON.parse(localStorage.getItem('inventory')) || {};

function addOrUpdateItem(cabinet, shelf, count) {
    cabinet = parseInt(cabinet);
    shelf = parseInt(shelf);
    count = parseInt(count);
    
    if (!inventory[cabinet]) {
        inventory[cabinet] = {};
    }
    
    if (inventory[cabinet][shelf]) {
        inventory[cabinet][shelf] += count;
    } else {
        inventory[cabinet][shelf] = count;
    }
    
    saveInventory();
    displayInventory();
}

function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function displayInventory() {
    const display = document.getElementById('inventoryDisplay');
    display.innerHTML = '';
    let grandTotal = 0;

    Object.keys(inventory).sort((a, b) => parseInt(a) - parseInt(b)).forEach(cabinet => {
        const cabinetElement = document.createElement('div');
        cabinetElement.className = 'cabinet';
        cabinetElement.innerHTML = <h2>ארון ${cabinet}</h2>;
        
        let cabinetTotal = 0;
        
        Object.keys(inventory[cabinet]).sort((a, b) => parseInt(a) - parseInt(b)).forEach(shelf => {
            const count = inventory[cabinet][shelf];
            const shelfElement = document.createElement('div');
            shelfElement.className = 'shelf';
            shelfElement.innerHTML = `
                <span>מדף ${shelf}: ${count} פריטים</span>
                <button class="edit-btn" onclick="editShelf(${cabinet}, ${shelf})">ערוך</button>
            `;
            cabinetElement.appendChild(shelfElement);
            cabinetTotal += count;
        });
        
        cabinetElement.innerHTML += <div class="total">סה"כ בארון: ${cabinetTotal}</div>;
        display.appendChild(cabinetElement);
        grandTotal += cabinetTotal;
    });
    
    const grandTotalElement = document.createElement('div');
    grandTotalElement.className = 'total';
    grandTotalElement.textContent = סה"כ כללי: ${grandTotal};
    display.appendChild(grandTotalElement);
}

function editShelf(cabinet, shelf) {
    const currentCount = inventory[cabinet][shelf];
    const newCount = prompt(עריכת כמות פריטים במדף ${shelf} בארון ${cabinet}. כמות נוכחית: ${currentCount}. הזן כמות חדשה:);
    
    if (newCount !== null) {
        const parsedCount = parseInt(newCount);
        if (!isNaN(parsedCount) && parsedCount >= 0) {
            inventory[cabinet][shelf] = parsedCount;
            if (parsedCount === 0) {
                delete inventory[cabinet][shelf];
                if (Object.keys(inventory[cabinet]).length === 0) {
                    delete inventory[cabinet];
                }
            }
            saveInventory();
            displayInventory();
        } else {
            alert('נא להזין מספר חיובי או 0');
        }
    }
}

function generateReport() {
    const reportOutput = document.getElementById('reportOutput');
    reportOutput.style.display = 'block';
    reportOutput.textContent = JSON.stringify(inventory, null, 2);
}

document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cabinet = document.getElementById('cabinetNumber').value;
    const shelf = document.getElementById('shelfNumber').value;
    const count = document.getElementById('itemCount').value;
    addOrUpdateItem(cabinet, shelf, count);
    this.reset();
});

document.getElementById('generateReport').addEventListener('click', generateReport);

displayInventory();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log('Service worker registered', reg))
    .catch((err) => console.log('Service worker not registered', err));
}