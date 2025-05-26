// Business Spotlight functionality
document.addEventListener('DOMContentLoaded', () => {
    const spotlightsContainer = document.getElementById('spotlights-container');
    
    // Mock member data
    const members = [
        {
            name: "Dash Financial Services",
            address: "456 Finance Ave, Dash City",
            phone: "(555) 234-5678",
            website: "https://dashfinancial.example.com",
            image: "images/dashfinancial.jpg",
            membershipLevel: "gold"
        },
        {
            name: "TechNova Solutions",
            address: "789 Innovation Dr, Dash City",
            phone: "(555) 345-6789",
            website: "https://technova.example.com",
            image: "images/technova.jpg",
            membershipLevel: "silver"
        },
        {
            name: "Dash Boutique",
            address: "123 Fashion St, Dash City",
            phone: "(555) 456-7890",
            website: "https://dashboutique.example.com",
            image: "images/dashboutique.jpg",
            membershipLevel: "gold"
        },
        {
            name: "Green Harvest Organics",
            address: "321 Nature Way, Dash City",
            phone: "(555) 567-8901",
            website: "https://greenharvest.example.com",
            image: "images/greenharvest.jpg",
            membershipLevel: "silver"
        },
        {
            name: "Dash Digital Marketing",
            address: "654 Web Lane, Dash City",
            phone: "(555) 678-9012",
            website: "https://dashdigital.example.com",
            image: "images/dashdigital.jpg",
            membershipLevel: "gold"
        }
    ];

    // Filter premium members
    const premiumMembers = members.filter(member => 
        member.membershipLevel === 'gold' || 
        member.membershipLevel === 'silver'
    );

    // Get random spotlights
    function getRandomSpotlights(members, count) {
        const shuffled = [...members];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    // Create spotlight cards
    function createSpotlightCards(members) {
        spotlightsContainer.innerHTML = '';
        
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'spotlight-card';
            
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name} Logo" class="spotlight-logo">
                <h3>${member.name}</h3>
                <p>${member.phone}</p>
                <p>${member.address}</p>
                <a href="${member.website}" target="_blank">Website</a>
                <div class="spotlight-level ${member.membershipLevel}">${member.membershipLevel} Member</div>
            `;
            
            spotlightsContainer.appendChild(card);
        });
    }

    // Initialize spotlights
    const spotlightCount = window.innerWidth >= 1024 ? 3 : 2;
    const spotlights = getRandomSpotlights(premiumMembers, spotlightCount);
    createSpotlightCards(spotlights);
});