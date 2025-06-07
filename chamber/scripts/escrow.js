document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (hamburgerBtn && primaryNav) {
        hamburgerBtn.onclick = function() {
            primaryNav.classList.toggle('open');
            return false;
        };
    }

    // Get the container for escrow transactions
    const escrowContainer = document.getElementById('escrow-transactions');
    
    // Fetch escrow data from JSON file
    fetch('../chamber/data/escrow.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading spinner
            const loadingSpinner = document.querySelector('.loading-spinner');
            if (loadingSpinner) {
                loadingSpinner.remove();
            }
            
            // Check if there are any transactions
            if (data.transactions && data.transactions.length > 0) {
                displayTransactions(data.transactions);
            } else {
                displayNoTransactionsMessage();
            }
        })
        .catch(error => {
            console.error('Error fetching escrow data:', error);
            displayNoTransactionsMessage();
        });

    // Function to display transactions
    function displayTransactions(transactions) {
        // Create table for transactions
        const table = document.createElement('table');
        table.className = 'escrow-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['ID', 'Date', 'Description', 'Amount', 'Status'];
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Add transaction data to row
            const idCell = document.createElement('td');
            idCell.textContent = transaction.id;
            row.appendChild(idCell);
            
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(transaction.date);
            row.appendChild(dateCell);
            
            const descCell = document.createElement('td');
            descCell.textContent = transaction.description;
            row.appendChild(descCell);
            
            const amountCell = document.createElement('td');
            amountCell.textContent = formatCurrency(transaction.amount);
            row.appendChild(amountCell);
            
            const statusCell = document.createElement('td');
            statusCell.textContent = capitalizeFirstLetter(transaction.status);
            statusCell.className = `status-${transaction.status.toLowerCase()}`;
            row.appendChild(statusCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        escrowContainer.appendChild(table);
    }

    // Function to display message when no transactions are found
    function displayNoTransactionsMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-transactions-message';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-info-circle';
        messageDiv.appendChild(icon);
        
        const message = document.createElement('p');
        message.textContent = 'You have not made any escrow transactions yet.';
        messageDiv.appendChild(message);
        
        escrowContainer.appendChild(messageDiv);
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Helper function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});