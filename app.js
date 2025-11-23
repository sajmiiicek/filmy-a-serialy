// ===== CONSTANTS =====
const STORAGE_KEY = 'movieTrackerItems';

// ===== DOM ELEMENTS =====
const addForm = document.getElementById('addForm');
const itemsList = document.getElementById('itemsList');
const itemCount = document.getElementById('itemCount');

// ===== STATE =====
let items = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    renderItems();
    
    // Add form submit listener
    addForm.addEventListener('submit', handleAddItem);
});

// ===== LOAD ITEMS FROM LOCALSTORAGE =====
function loadItems() {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    
    if (storedItems) {
        items = JSON.parse(storedItems);
    } else {
        // Placeholder data - 2 example items
        items = [
            {
                id: generateId(),
                title: 'Inception',
                platform: 'Netflix',
                year: 2010,
                rating: 10,
                type: 'Film',
                dateAdded: new Date().toISOString()
            },
            {
                id: generateId(),
                title: 'Stranger Things',
                platform: 'Netflix',
                year: 2016,
                rating: 9,
                type: 'Seriál',
                dateAdded: new Date().toISOString()
            }
        ];
        saveItems();
    }
}

// ===== SAVE ITEMS TO LOCALSTORAGE =====
function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ===== GENERATE UNIQUE ID =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== HANDLE ADD ITEM =====
function handleAddItem(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('title').value.trim();
    const platform = document.getElementById('platform').value.trim();
    const year = parseInt(document.getElementById('year').value);
    const rating = parseInt(document.getElementById('rating').value);
    const type = document.querySelector('input[name="type"]:checked').value;
    
    // Create new item
    const newItem = {
        id: generateId(),
        title,
        platform,
        year,
        rating,
        type,
        dateAdded: new Date().toISOString()
    };
    
    // Add to items array
    items.unshift(newItem); // Add to beginning for newest first
    
    // Save and render
    saveItems();
    renderItems();
    
    // Reset form
    addForm.reset();
    
    // Show success feedback
    showSuccessAnimation();
}

// ===== SHOW SUCCESS ANIMATION =====
function showSuccessAnimation() {
    const button = document.querySelector('.btn-add');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// ===== RENDER ITEMS =====
function renderItems() {
    // Update count
    itemCount.textContent = items.length;
    
    // Clear list
    itemsList.innerHTML = '';
    
    // Check if empty
    if (items.length === 0) {
        itemsList.innerHTML = `
            <div class="empty-state">
                Zatím nemáš žádné filmy nebo seriály.<br>
                Přidej svůj první záznam!
            </div>
        `;
        return;
    }
    
    // Render each item
    items.forEach((item, index) => {
        const itemCard = createItemCard(item, index);
        itemsList.appendChild(itemCard);
    });
}

// ===== CREATE ITEM CARD =====
function createItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Generate stars based on rating
    const stars = generateStars(item.rating);
    
    card.innerHTML = `
        <div class="item-header">
            <div>
                <h3 class="item-title">${escapeHtml(item.title)}</h3>
                <span class="item-type">${item.type === 'Film' ? '🎥' : '📺'} ${item.type}</span>
            </div>
        </div>
        
        <div class="item-details">
            <div class="item-detail">
                <span class="item-detail-label">Platforma:</span>
                <span>${escapeHtml(item.platform)}</span>
            </div>
            <div class="item-detail">
                <span class="item-detail-label">Rok:</span>
                <span>${item.year}</span>
            </div>
            <div class="item-rating">
                <span class="item-detail-label">Hodnocení:</span>
                <span>${item.rating}/10</span>
                <span class="stars">${stars}</span>
            </div>
        </div>
        
        <div class="item-footer">
            <button class="btn-delete" onclick="deleteItem('${item.id}')">
                🗑️ Smazat
            </button>
        </div>
    `;
    
    return card;
}

// ===== GENERATE STARS =====
function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (halfStar) {
        stars += '⭐';
    }
    
    return stars || '☆';
}

// ===== DELETE ITEM =====
function deleteItem(id) {
    // Find the card element
    const cards = document.querySelectorAll('.item-card');
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1 && cards[itemIndex]) {
        // Add removing animation
        cards[itemIndex].classList.add('removing');
        
        // Wait for animation to complete
        setTimeout(() => {
            // Remove from array
            items = items.filter(item => item.id !== id);
            
            // Save and re-render
            saveItems();
            renderItems();
        }, 300);
    }
}

// ===== ESCAPE HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== UTILITY: Clear all data (for testing) =====
function clearAllData() {
    if (confirm('Opravdu chceš smazat všechna data?')) {
        items = [];
        saveItems();
        renderItems();
    }
}

// Make deleteItem available globally
window.deleteItem = deleteItem;
window.clearAllData = clearAllData;
