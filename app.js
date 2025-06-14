// Array with example of numbers
const numbers = [42, 7, 13, 21, 100, 365];

// Retrievs a fact about a number
async function getNumberFact(number, type = '') {
    try {
        const url = `http://numbersapi.com/${number}${type ? '/' + type : ''}?json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Create a card with a number fact
function createCard(number, fact) {
    const article = document.createElement('article');
    article.className = 'bg-white p-4 rounded shadow';
    article.innerHTML = `
        <header>
            <h3 class="text-xl font-bold text-blue-600 mb-2">${number}</h3>
        </header>
        <section>
            <p class="mb-4">${fact}</p>
        </section>
        <footer>
            <button onclick="showMoreFacts(${number})" class="text-blue-600">
                Learn More →
            </button>
        </footer>
    `;
    return article;
}

// More facts about a number
async function showMoreFacts(number) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    // Show loading message
    modalTitle.textContent = `Loading facts about ${number}...`;
    modalContent.textContent = 'Please wait...';
    modal.classList.remove('hidden');

    try {
        // Get different types of facts
        const [trivia, math, year] = await Promise.all([
            getNumberFact(number),
            getNumberFact(number, 'math'),
            getNumberFact(number, 'year')
        ]);

        // Show the facts
        modalTitle.textContent = `Facts about ${number}`;
        modalContent.innerHTML = `
            <section class="space-y-4">
                <article>
                    <h4 class="font-bold">Trivia:</h4>
                    <p>${trivia?.text || 'No trivia available'}</p>
                </article>
                <article>
                    <h4 class="font-bold">Math:</h4>
                    <p>${math?.text || 'No math fact available'}</p>
                </article>
                <article>
                    <h4 class="font-bold">Year:</h4>
                    <p>${year?.text || 'No year fact available'}</p>
                </article>
            </section>
        `;
    } catch (error) {
        modalContent.innerHTML = '<p class="text-red-600">Error loading facts. Please try again.</p>';
    }
}

// Closing the modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

//Error message
function showError(message) {
    const numbersGrid = document.getElementById('numbers-grid');
    numbersGrid.innerHTML = `
        <article class="col-span-full bg-red-50 text-red-600 p-4 rounded-lg text-center">
            <p>${message}</p>
        </article>
    `;
}

//Handle search
async function handleSearch(event) {
    event.preventDefault();
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value.trim();
    
    // Check if input is empty
    if (!number) {
        showError('Please enter a number to search');
        return;
    }

    const numbersGrid = document.getElementById('numbers-grid');
    numbersGrid.innerHTML = ''; // Clear previous results

    try {
        const fact = await getNumberFact(number);
        if (fact) {
            const card = createCard(number, fact.text);
            numbersGrid.appendChild(card);
        } else {
            numbersGrid.innerHTML = '<article class="text-red-600">No facts found for this number. Try another one!</article>';
        }
    } catch (error) {
        numbersGrid.innerHTML = '<article class="text-red-600">Error loading facts. Please try again.</article>';
    }
}

// Load initial numbers 
async function loadInitialNumbers() {
    const numbersGrid = document.getElementById('numbers-grid');
    
    try {
        // Get facts for all numbers at once
        const facts = await Promise.all(numbers.map(number => getNumberFact(number)));
        
        // Create cards for each number
        facts.forEach((fact, index) => {
            if (fact) {
                const card = createCard(numbers[index], fact.text);
                numbersGrid.appendChild(card);
            }
        });
    } catch (error) {
        numbersGrid.innerHTML = '<article class="text-red-600">Error loading numbers. Please refresh the page.</article>';
    }
}

// Add event listener for the search form
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Load initial numbers when the page loads
document.addEventListener('DOMContentLoaded', loadInitialNumbers); 