// Manage an array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Please add some quotes!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
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
    categoryElement.style.fontStyle = 'italic';
    categoryElement.style.color = '#666';
    
    quoteElement.appendChild(textElement);
    quoteElement.appendChild(categoryElement);
    quoteDisplay.appendChild(quoteElement);
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    // Check if form already exists
    if (document.getElementById('addQuoteForm')) {
        return;
    }
    
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';
    formContainer.style.marginTop = '20px';
    formContainer.style.padding = '15px';
    formContainer.style.border = '1px solid #ddd';
    formContainer.style.borderRadius = '5px';
    formContainer.style.backgroundColor = '#f9f9f9';
    
    const title = document.createElement('h3');
    title.textContent = 'Add New Quote';
    formContainer.appendChild(title);
    
    // Create text input
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';
    textInput.style.width = '100%';
    textInput.style.padding = '8px';
    textInput.style.margin = '5px 0';
    textInput.style.border = '1px solid #ccc';
    textInput.style.borderRadius = '3px';
    formContainer.appendChild(textInput);
    
    // Create category input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    categoryInput.style.width = '100%';
    categoryInput.style.padding = '8px';
    categoryInput.style.margin = '5px 0';
    categoryInput.style.border = '1px solid #ccc';
    categoryInput.style.borderRadius = '3px';
    formContainer.appendChild(categoryInput);
    
    // Create add button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.style.padding = '8px 15px';
    addButton.style.margin = '10px 0';
    addButton.style.backgroundColor = '#007bff';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '3px';
    addButton.style.cursor = 'pointer';
    
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
    const newQuote = {
        text: text,
        category: category
    };
    
    // Add to quotes array
    quotes.push(newQuote);
    
    // Clear input fields
    textInput.value = '';
    categoryInput.value = '';
    
    // Show success message
    alert('Quote added successfully!');
    
    // Optionally show the new quote
    showRandomQuote();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show initial random quote
    showRandomQuote();
    
    // Add event listener to "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    
    // Create the add quote form
    createAddQuoteForm();
    
    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        #quoteDisplay {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quote-text {
            font-size: 1.2em;
            margin: 0;
            color: #333;
        }
        .quote-category {
            margin: 10px 0 0 0;
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
        input:focus {
            outline: none;
            border-color: #007bff !important;
        }
    `;
    document.head.appendChild(style);
});