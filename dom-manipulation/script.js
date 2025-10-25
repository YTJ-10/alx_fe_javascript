// Manage an array of quote objects
let quotes = [];
let selectedCategory = 'all';
let lastSyncTime = null;
let syncInterval = null;

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
    
    // Create sync controls
    createSyncControls();
    
    // Start periodic syncing
    startPeriodicSync();
    
    // Add styling
    addStyles();
});

// Simulated server URL (using JSONPlaceholder for posts simulation)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Load quotes from local storage
function loadQuotesFromStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    const storedSyncTime = localStorage.getItem('lastSyncTime');
    
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Initialize with default quotes if no stored quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration", id: generateId(), version: 1 },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership", id: generateId(), version: 1 },
            { text: "Life is what happens to you while you're busy making other plans.", category: "Life", id: generateId(), version: 1 },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", id: generateId(), version: 1 }
        ];
        saveQuotesToLocalStorage();
    }
    
    lastSyncTime = storedSyncTime || new Date().toISOString();
    
    // Store last load time in session storage
    sessionStorage.setItem('lastLoaded', new Date().toLocaleString());
}

// Generate unique ID for quotes
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastSyncTime', lastSyncTime);
}

// Load last selected filter from local storage
function loadLastFilter() {
    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        selectedCategory = lastFilter;
        document.getElementById('categoryFilter').value = selectedCategory;
    }
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
        
        // Add sync indicator if quote has been modified locally
        if (quote.localModified) {
            const syncIndicator = document.createElement('span');
            syncIndicator.textContent = ' ⚡ (Pending Sync)';
            syncIndicator.className = 'sync-indicator';
            categoryElement.appendChild(syncIndicator);
        }
        
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
    
    // Create new quote object with sync metadata
    const newQuote = { 
        text: text, 
        category: category,
        id: generateId(),
        version: 1,
        localModified: true,
        createdAt: new Date().toISOString()
    };
    
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
    alert('Quote added successfully! It will be synced with the server.');
    
    // Refresh the display if the new quote matches the current filter
    if (selectedCategory === 'all' || selectedCategory === category) {
        displayFilteredQuotes();
    }
    
    // Trigger sync
    syncWithServer();
}

// Create sync controls
function createSyncControls() {
    const syncContainer = document.createElement('div');
    syncContainer.id = 'syncControls';
    syncContainer.className = 'sync-controls';
    
    syncContainer.innerHTML = `
        <h3>Data Synchronization</h3>
        <button id="manualSync" class="sync-btn">Sync Now</button>
        <button id="resolveConflicts" class="resolve-btn" style="display: none;">Resolve Conflicts</button>
        <div id="syncStatus" class="sync-status">Last sync: ${lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Never'}</div>
        <div id="conflictNotification" class="conflict-notification" style="display: none;"></div>
    `;
    
    // Insert before data controls
    const dataControls = document.getElementById('dataControls');
    dataControls.parentNode.insertBefore(syncContainer, dataControls);
    
    // Add event listeners
    document.getElementById('manualSync').addEventListener('click', syncWithServer);
    document.getElementById('resolveConflicts').addEventListener('click', showConflictResolution);
}

// Start periodic syncing
function startPeriodicSync() {
    // Sync every 30 seconds
    syncInterval = setInterval(syncWithServer, 30000);
}

// Fetch quotes from server (simulated)
async function fetchQuotesFromServer() {
    try {
        console.log('Fetching quotes from server...');
        
        // Simulate actual fetch call with POST method and headers
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'demo-key-12345',
                'User-Agent': 'QuoteGenerator/1.0'
            },
            body: JSON.stringify({
                action: 'getQuotes',
                lastSync: lastSyncTime,
                clientId: 'quote-generator-client'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const serverData = await response.json();
        
        // Since JSONPlaceholder returns mock data, we'll simulate our own server response
        // In a real app, this would be the actual server response
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        const serverQuotes = [
            { 
                id: 'server1', 
                text: "The only way to do great work is to love what you do. (Server Enhanced)", 
                category: "Inspiration", 
                version: 2,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            { 
                id: 'server2', 
                text: "Innovation distinguishes between a leader and a follower.", 
                category: "Leadership", 
                version: 2,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            { 
                id: 'server3', 
                text: "Life is what happens to you while you're busy making other plans.", 
                category: "Life", 
                version: 1,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            { 
                id: 'server4', 
                text: "The future belongs to those who believe in the beauty of their dreams.", 
                category: "Dreams", 
                version: 1,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            { 
                id: 'server5', 
                text: "This is a new quote added from the server during synchronization.", 
                category: "Motivation", 
                version: 1,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        ];
        
        console.log('Successfully fetched quotes from server:', serverQuotes.length);
        return serverQuotes;
        
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        throw new Error('Failed to fetch quotes from server: ' + error.message);
    }
}

// Send local changes to server
async function sendLocalChangesToServer() {
    try {
        const localChanges = quotes.filter(quote => quote.localModified);
        
        if (localChanges.length === 0) {
            console.log('No local changes to send to server');
            return { success: true, message: 'No changes to sync' };
        }
        
        console.log(`Sending ${localChanges.length} local changes to server...`);
        
        // Simulate sending changes to server with POST method and headers
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'demo-key-12345',
                'User-Agent': 'QuoteGenerator/1.0'
            },
            body: JSON.stringify({
                action: 'updateQuotes',
                changes: localChanges,
                clientId: 'quote-generator-client',
                syncTimestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Simulate server processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Successfully sent local changes to server');
        return { success: true, processed: localChanges.length };
        
    } catch (error) {
        console.error('Error sending changes to server:', error);
        throw new Error('Failed to send changes to server: ' + error.message);
    }
}

// Sync with server (simulated)
async function syncWithServer() {
    const syncStatus = document.getElementById('syncStatus');
    const syncBtn = document.getElementById('manualSync');
    
    try {
        syncStatus.textContent = 'Syncing...';
        syncBtn.disabled = true;
        
        // Step 1: Send local changes to server using POST method
        const sendResult = await sendLocalChangesToServer();
        
        // Step 2: Fetch updated quotes from server
        const serverQuotes = await fetchQuotesFromServer();
        
        // Step 3: Merge server quotes with local quotes
        const conflicts = mergeQuotes(serverQuotes);
        
        // Step 4: Clear local modification flags for successfully synced quotes
        quotes.forEach(quote => {
            if (quote.localModified) {
                // In a real app, this would only happen after server confirms receipt
                // For simulation, we'll clear the flag
                delete quote.localModified;
            }
        });
        
        // Save merged quotes
        saveQuotesToLocalStorage();
        
        // Update UI
        lastSyncTime = new Date().toISOString();
        syncStatus.textContent = `Last sync: ${new Date(lastSyncTime).toLocaleString()}`;
        
        // Show conflicts if any
        if (conflicts.length > 0) {
            showConflictNotification(conflicts);
        } else {
            hideConflictNotification();
        }
        
        // Refresh display
        populateCategories();
        displayFilteredQuotes();
        
        // Show success message
        showSyncNotification(`Sync completed! ${sendResult.processed || 0} changes sent to server.`, 'success');
        
    } catch (error) {
        syncStatus.textContent = `Sync failed: ${error.message}`;
        showSyncNotification('Sync failed!', 'error');
    } finally {
        syncBtn.disabled = false;
    }
}

// Merge server quotes with local quotes
function mergeQuotes(serverQuotes) {
    const conflicts = [];
    const mergedQuotes = [];
    const quoteMap = new Map();
    
    // Add all server quotes to map
    serverQuotes.forEach(quote => {
        quoteMap.set(quote.id, { ...quote, source: 'server' });
    });
    
    // Merge with local quotes
    quotes.forEach(localQuote => {
        const serverQuote = quoteMap.get(localQuote.id);
        
        if (serverQuote) {
            // Quote exists on both client and server
            if (serverQuote.version > localQuote.version) {
                // Server version is newer - use server data
                mergedQuotes.push(serverQuote);
                conflicts.push({
                    id: localQuote.id,
                    local: localQuote,
                    server: serverQuote,
                    resolved: 'server'
                });
            } else if (localQuote.localModified) {
                // Local has modifications - keep local (will be sent to server)
                mergedQuotes.push(localQuote);
            } else {
                // Same version, no conflicts
                mergedQuotes.push(serverQuote);
            }
            quoteMap.delete(localQuote.id);
        } else {
            // Local quote doesn't exist on server - keep it
            mergedQuotes.push(localQuote);
        }
    });
    
    // Add remaining server quotes (new quotes from server)
    quoteMap.forEach(serverQuote => {
        mergedQuotes.push(serverQuote);
    });
    
    // Update the main quotes array
    quotes = mergedQuotes;
    
    return conflicts;
}

// Show conflict notification
function showConflictNotification(conflicts) {
    const conflictNotification = document.getElementById('conflictNotification');
    const resolveBtn = document.getElementById('resolveConflicts');
    
    conflictNotification.innerHTML = `
        <strong>Conflict Detected!</strong> 
        ${conflicts.length} quote(s) have conflicts between local and server versions.
    `;
    conflictNotification.style.display = 'block';
    resolveBtn.style.display = 'inline-block';
    
    // Store conflicts for resolution
    sessionStorage.setItem('pendingConflicts', JSON.stringify(conflicts));
}

// Hide conflict notification
function hideConflictNotification() {
    const conflictNotification = document.getElementById('conflictNotification');
    const resolveBtn = document.getElementById('resolveConflicts');
    
    conflictNotification.style.display = 'none';
    resolveBtn.style.display = 'none';
    sessionStorage.removeItem('pendingConflicts');
}

// Show conflict resolution interface
function showConflictResolution() {
    const conflicts = JSON.parse(sessionStorage.getItem('pendingConflicts') || '[]');
    
    if (conflicts.length === 0) {
        alert('No conflicts to resolve!');
        return;
    }
    
    const resolution = confirm(
        `Found ${conflicts.length} conflict(s).\n\n` +
        'Click OK to accept server versions, or Cancel to keep local versions.'
    );
    
    if (resolution) {
        // Accept server versions
        conflicts.forEach(conflict => {
            const index = quotes.findIndex(q => q.id === conflict.id);
            if (index !== -1) {
                quotes[index] = conflict.server;
            }
        });
    } else {
        // Keep local versions (mark them for server update)
        conflicts.forEach(conflict => {
            const index = quotes.findIndex(q => q.id === conflict.id);
            if (index !== -1) {
                quotes[index].localModified = true;
                quotes[index].version = Math.max(quotes[index].version, conflict.server.version) + 1;
            }
        });
    }
    
    saveQuotesToLocalStorage();
    hideConflictNotification();
    displayFilteredQuotes();
    showSyncNotification('Conflicts resolved!', 'success');
}

// Show sync notification
function showSyncNotification(message, type) {
    // Create or update notification element
    let notification = document.getElementById('syncNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'syncNotification';
        notification.className = 'sync-notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `sync-notification ${type}`;
    notification.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
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
            quotes.push(...validQuotes.map(quote => ({
                ...quote,
                id: quote.id || generateId(),
                version: quote.version || 1,
                localModified: true
            })));
            
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
        .sync-indicator {
            color: #ff6b00;
            font-weight: bold;
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
        button:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }
        .sync-btn {
            background-color: #28a745;
        }
        .sync-btn:hover {
            background-color: #218838;
        }
        .resolve-btn {
            background-color: #ffc107;
            color: #212529;
        }
        .resolve-btn:hover {
            background-color: #e0a800;
        }
        .form-container, #dataControls, .sync-controls {
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
        .filter-info, .session-info, .sync-status {
            margin: 10px 0;
            color: #666;
            font-size: 0.9em;
        }
        .conflict-notification {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .sync-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            display: none;
        }
        .sync-notification.success {
            background-color: #28a745;
        }
        .sync-notification.error {
            background-color: #dc3545;
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
