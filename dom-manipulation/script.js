// Manage an array of quote objects
let quotes = [];
let selectedCategory = 'all';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadQuotesFromStorage();
    loadLastFilter();
    populateCategories();
    showRandomQuote();
    
    // Add event listener to "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    
    // Add event listener to category filter
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
    
    // Create the add quote form
    createAddQuoteForm();
    
    // Add styling
    addStyles();
});

// Load quotes from local storage
function loadQuotesFromStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Initialize with default quotes if no stored quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
            { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
        ];
        saveQuotesToLocalStorage();
    }
    
    // Store last load time in session storage
    sessionStorage.setItem('lastLoaded', new Date().toLocaleString());
}

// Load last selected filter from local storage
function loadLastFilter() {
    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        selectedCategory = lastFilter;
        document.getElementById('categoryFilter').value = selectedCategory;
    }
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save current filter to local storage
function saveFilterToLocalStorage() {
    localStorage.setItem('lastFilter', selectedCategory);
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Get all existing categories from quotes
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except "All Categories"
    const allOption = categoryFilter.querySelector('option[value="all"]');
    categoryFilter.innerHTML = '';
    categoryFilter.appendChild(allOption);
    
    // Add categories to dropdown
    categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Restore last selected filter
    categoryFilter.value = selectedCategory;
}

// Filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    selectedCategory = categoryFilter.value;
    
    // Save filter preference
    saveFilterToLocalStorage();
    
    // Display filtered quotes
    displayFilteredQuotes();
}

// Display filtered quotes
function displayFilteredQuotes() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Filter quotes based on selectedCategory
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in category "${selectedCategory}".</p>`;
        return;
    }
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    // Create quote elements for filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        
        const textElement = document.createElement('p');
        textElement.textContent = `"${quote.text}"`;
        textElement.className = 'quote-text';
        
        const categoryElement = document.createElement('p');
        categoryElement.textContent = `- ${quote.category}`;
        categoryElement.className = 'quote-category';
        
        quoteElement.appendChild(textElement);
        quoteElement.appendChild(categoryElement);
        quoteDisplay.appendChild(quoteElement);
    });
    
    // Display filter info
    displayFilterInfo(filteredQuotes.length);
}

// Display filter information
function displayFilterInfo(filteredCount) {
    let filterInfo = document.getElementById('filterInfo');
    if (!filterInfo) {
        filterInfo = document.createElement('div');
        filterInfo.id = 'filterInfo';
        filterInfo.className = 'filter-info';
        document.getElementById('quoteDisplay').parentNode.insertBefore(filterInfo, document.getElementById('quoteDisplay').nextSibling);
    }
    
    const totalCount = quotes.length;
    const categoryText = selectedCategory === 'all' ? 'All Categories' : selectedCategory;
    
    filterInfo.innerHTML = `
        <small>Showing ${filteredCount} of ${totalCount} quotes in "${categoryText}"</small>
    `;
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Filter quotes based on selectedCategory
    let availableQuotes = quotes;
    if (selectedCategory !== 'all') {
        availableQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    
    if (availableQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available in category "${selectedCategory}".</p>`;
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const randomQuote = availableQuotes[randomIndex];
    
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    sessionStorage.setItem('lastViewedTime', new Date().toLocaleString());
    
    // Clear previous content and create new quote display
    quoteDisplay.innerHTML = '';
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    const textElement = document.createElement('p');
    textElement.textContent = `"${randomQuote.text}"`;
    textElement.className = 'quote-text';
    
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `- ${randomQuote.category}`;
    categoryElement.className = 'quote-category';
    
    quoteElement.appendChild(textElement);
    quoteElement.appendChild(categoryElement);
    quoteDisplay.appendChild(quoteElement);
    
    // Display filter info
    displayFilterInfo(availableQuotes.length);
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    if (document.getElementById('addQuoteForm')) return;
    
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';
    formContainer.className = 'form-container';
    
    const title = document.createElement('h3');
    title.textContent = 'Add New Quote';
    formContainer.appendChild(title);
    
    // Create text input
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';
    formContainer.appendChild(textInput);
    
    // Create category input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    formContainer.appendChild(categoryInput);
    
    // Create add button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
    formContainer.appendChild(addButton);
    
    // Insert the form after the quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(formContainer, quoteDisplay.nextSibling);
}

// Function to add a new quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    
    if (!text || !category) {
        alert('Please enter both quote text and category!');
        return;
    }
    
    // Create new quote object
    const newQuote = { text: text, category: category };
    
    // Add to quotes array
    quotes.push(newQuote);
    
    // Save to local storage
    saveQuotesToLocalStorage();
    
    // Update categories dropdown
    populateCategories();
    
    // Clear input fields
    textInput.value = '';
    categoryInput.value = '';
    
    // Show success message
    alert('Quote added successfully!');
    
    // Refresh the display if the new quote matches the current filter
    if (selectedCategory === 'all' || selectedCategory === category) {
        displayFilteredQuotes();
    }
}

// Export quotes to JSON file
function exportToJson() {
    if (quotes.length === 0) {
        alert('No quotes to export!');
        return;
    }
    
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${quotes.length} quotes successfully!`);
}

// Import quotes from JSON file
function importFromJson() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a JSON file to import!');
        return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid JSON format: Expected an array of quotes');
            }
            
            // Validate each quote has text and category
            const validQuotes = importedQuotes.filter(quote => 
                quote && typeof quote.text === 'string' && typeof quote.category === 'string'
            );
            
            if (validQuotes.length === 0) {
                throw new Error('No valid quotes found in the file');
            }
            
            // Add imported quotes to existing quotes
            quotes.push(...validQuotes);
            saveQuotesToLocalStorage();
            
            // Update categories dropdown
            populateCategories();
            
            // Clear file input
            fileInput.value = '';
            
            alert(`Successfully imported ${validQuotes.length} quotes! Total quotes: ${quotes.length}`);
            displayFilteredQuotes();
            
        } catch (error) {
            alert('Error importing quotes: ' + error.message);
        }
    };
    
    fileReader.onerror = function() {
        alert('Error reading the file');
    };
    
    fileReader.readAsText(file);
}

// Add styles to the document
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        #filterSection {
            margin: 20px 0;
        }
        #categoryFilter {
            padding: 8px;
            margin-left: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #quoteDisplay {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            min-height: 80px;
        }
        .quote {
            margin: 15px 0;
            padding: 15px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .quote-text {
            font-size: 1.2em;
            margin: 0;
            color: #333;
        }
        .quote-category {
            margin: 10px 0 0 0;
            font-style: italic;
            color: #666;
        }
        button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .form-container, #dataControls {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
            text-align: left;
        }
        input {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 3px;
            box-sizing: border-box;
        }
        input:focus {
            outline: none;
            border-color: #007bff;
        }
        .filter-info, .session-info {
            margin: 10px 0;
            color: #666;
            font-size: 0.9em;
        }
        .import-section {
            margin: 15px 0;
        }
        h3 {
            margin-top: 0;
            color: #333;
        }
    `;
    document.head.appendChild(style);
}
