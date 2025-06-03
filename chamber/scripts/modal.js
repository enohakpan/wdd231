// Modal Dialog functionality for Chamber of Commerce site

document.addEventListener('DOMContentLoaded', () => {
    // Get the modal dialog element
    const courseDetails = document.getElementById('courseDetails');
    
    // Function to display course details in modal
    function displayCourseDetails(course) {
        courseDetails.innerHTML = '';
        courseDetails.innerHTML = `
            <button id="closeModal">❌</button>
            <h2>${course.subject} ${course.number}</h2>
            <h3>${course.title}</h3>
            <p><strong>Credits</strong>: ${course.credits}</p>
            <p><strong>Certificate</strong>: ${course.certificate}</p>
            <p>${course.description}</p>
            <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
        `;
        courseDetails.showModal();
        
        // Add event listener to close button
        document.getElementById('closeModal').addEventListener('click', () => {
            courseDetails.close();
        });
        
        // Close modal when clicking outside of it
        courseDetails.addEventListener('click', (e) => {
            const dialogDimensions = courseDetails.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                courseDetails.close();
            }
        });
    }
    
    // Add click event listeners to membership cards
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get membership data from the card
            const membershipType = card.classList[1].split('-')[0]; // np-card, bronze-card, etc.
            const membershipData = getMembershipData(membershipType);
            displayCourseDetails(membershipData);
        });
    });
    
    // Function to get membership data
    function getMembershipData(type) {
        const membershipData = {
            np: {
                subject: "NP",
                number: "Membership",
                title: "Non-Profit Organization",
                credits: "Free",
                certificate: "Basic",
                description: "For non-profit organizations. Includes basic directory listing, networking event invitations, monthly newsletter, and community event participation.",
                technology: ["Basic Directory Listing", "Networking Events", "Monthly Newsletter", "Community Events"]
            },
            bronze: {
                subject: "Bronze",
                number: "Membership",
                title: "Small Business",
                credits: "$50/yr",
                certificate: "Standard",
                description: "For small businesses. Includes enhanced directory listing, networking event invitations, monthly newsletter, social media mention (quarterly), and small business resources.",
                technology: ["Enhanced Directory Listing", "Networking Events", "Monthly Newsletter", "Quarterly Social Media", "Business Resources"]
            },
            silver: {
                subject: "Silver",
                number: "Membership",
                title: "Medium Business",
                credits: "$100/yr",
                certificate: "Premium",
                description: "For medium businesses. Includes all Bronze benefits plus featured rotation on homepage, monthly social media promotion, 10% event discounts, business training workshops, and advertising opportunities.",
                technology: ["All Bronze Benefits", "Homepage Feature", "Monthly Social Media", "Event Discounts", "Training Workshops", "Advertising"]
            },
            gold: {
                subject: "Gold",
                number: "Membership",
                title: "Large Business",
                credits: "$250/yr",
                certificate: "Elite",
                description: "For large businesses. Includes all Silver benefits plus premium directory placement, dedicated business spotlight, 25% event discounts, event sponsorship opportunities, business consulting services, legislative advocacy, and press release distribution.",
                technology: ["All Silver Benefits", "Premium Directory", "Business Spotlight", "25% Event Discounts", "Sponsorship", "Consulting", "Advocacy", "Press Releases"]
            }
        };
        
        return membershipData[type] || membershipData.np;
    }
});