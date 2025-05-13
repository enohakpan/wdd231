// Get DOM elements
const memberContainer = document.getElementById('member-container');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');

// Fetch member data
async function getMembers() {
    try {
        console.log('Attempting to fetch members data...');
        const response = await fetch('./data/members.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (!data.members || !Array.isArray(data.members)) {
            throw new Error('Invalid data format: members array not found');
        }
        
        displayMembers(data.members);
    } catch (error) {
        console.error('Error loading members:', error);
        memberContainer.innerHTML = `
            <div class="error-message">
                <p>Error loading member data. Please try again later.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Display members in the selected view
function displayMembers(members) {
    console.log('Displaying members:', members);
    memberContainer.innerHTML = '';
    
    if (!members || members.length === 0) {
        memberContainer.innerHTML = '<p>No members found.</p>';
        return;
    }
    
    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        memberCard.innerHTML = `
            <img src="./images/${member.image}" alt="${member.name} logo" onerror="this.src='./images/placeholder.png'">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>📞 ${member.phone}</p>
            <p>🌐 <a href="${member.website}" target="_blank">Visit Website</a></p>
            <p class="membership-level">${getMembershipLevel(member.level)}</p>
            <p class="description">${member.description}</p>
        `;
        
        memberContainer.appendChild(memberCard);
    });
}

// Get membership level text
function getMembershipLevel(level) {
    switch(level) {
        case 1: return 'Member';
        case 2: return 'Silver Member';
        case 3: return 'Gold Member';
        default: return 'Member';
    }
}

// Toggle between grid and list views
gridViewBtn.addEventListener('click', () => {
    memberContainer.className = 'grid-view';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    memberContainer.className = 'list-view';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    getMembers();
    
    // Set copyright year
    document.getElementById('currentyear').textContent = new Date().getFullYear();
    
    // Set last modified date
    document.getElementById('lastmodified').textContent = document.lastModified;
}); 