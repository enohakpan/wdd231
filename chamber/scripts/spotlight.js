// Business Spotlight functionality
document.addEventListener('DOMContentLoaded', () => {
    const spotlightsContainer = document.getElementById('spotlights-container');
    
    // Fetch members data from JSON file
    async function fetchMembers() {
        try {
            const response = await fetch('../data/members.json');
            if (!response.ok) throw new Error('Failed to load members data');
            
            const data = await response.json();
            return data.members;
        } catch (error) {
            console.error('Error loading members data:', error);
            // Fallback to hardcoded data if JSON fetch fails
            return [
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
                },
                {
                    name: "Dash Wellness Center",
                    address: "246 Health Ave, Dash City",
                    phone: "(555) 890-1234",
                    website: "https://dashwellness.example.com",
                    image: "images/dashwellness.jpg",
                    membershipLevel: "gold"
                }
            ];
        }
    }

    // Filter premium members (gold or silver)
    function filterPremiumMembers(members) {
        return members.filter(member => 
            member.membershipLevel === 'gold' || 
            member.membershipLevel === 'silver'
        );
    }

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
            
            // Fix image path if needed (JSON has "../images/" but we need "images/")
            const imagePath = member.image.includes('../') 
                ? member.image.replace('../', '') 
                : member.image;
            
            card.innerHTML = `
                <img src="${imagePath}" alt="${member.name} Logo" class="spotlight-logo">
                <h3>${member.name}</h3>
                <p>${member.phone}</p>
                <p>${member.address}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
                <div class="spotlight-level ${member.membershipLevel}">${member.membershipLevel} Member</div>
            `;
            
            spotlightsContainer.appendChild(card);
        });
    }

    // Initialize spotlights
    async function initSpotlights() {
        // Get members data
        const members = await fetchMembers();
        
        // Filter premium members
        const premiumMembers = filterPremiumMembers(members);
        
        // Determine how many spotlights to show based on screen size
        const spotlightCount = window.innerWidth >= 1024 ? 3 : 2;
        
        // Get random spotlights
        const spotlights = getRandomSpotlights(premiumMembers, spotlightCount);
        
        // Create spotlight cards
        createSpotlightCards(spotlights);
    }

    // Start the process
    initSpotlights();
});