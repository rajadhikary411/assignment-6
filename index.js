// FAQ & Learn Button Smooth Scroll
document.getElementById("faq-btn").addEventListener("click", function () {
    document.getElementById("faq-section").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("learn-btn").addEventListener("click", function () {
    document.getElementById("learn-section").scrollIntoView({ behavior: "smooth" });
});

// Get elements
const getStartedBtn = document.getElementById('get-started-btn'); 
const passwordInput = document.getElementById('password-input'); 
const nameInput = document.getElementById('name-input'); 

const headerSection = document.getElementById('header'); 
const lessonSection = document.getElementById('learn-section'); 
const faqSection = document.getElementById('faq-section'); 
const footerSection = document.getElementById('footer'); 
const dynamicContent = document.getElementById("dynamic-content");

// Initially hide sections
headerSection.classList.add('hidden');
lessonSection.classList.add('hidden');
faqSection.classList.add('hidden');
footerSection.classList.add('hidden');

// Add event listener for "Get started" button
getStartedBtn.addEventListener('click', function() {
    if (nameInput.value.trim() === '') {
        alert('Please enter your name first.');
        return;
    }

    if (passwordInput.value === '123456') {
        headerSection.classList.remove('hidden');
        lessonSection.classList.remove('hidden');
        faqSection.classList.remove('hidden');
        footerSection.classList.remove('hidden');
    } else {
        alert('Invalid password. Please try again.');
    }
});

// Lesson Button Load from API
document.addEventListener('DOMContentLoaded', function () {
    // আপনার অন্যান্য কোড এখানে থাকবে

    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(response => response.json())
        .then(data => {
            if (!data.data) {
                console.error("No data found in API response");
                return;
            }

            const updatedLessons = data.data.map(item => 
                `<button class="btn btn-outline btn-primary mr-3 normal-case lesson-btn" data-level="${item.level_no}">Lesson -${item.level_no}</button>`
            ).join(""); 

            document.getElementById("dynamic-button").innerHTML = updatedLessons;

            // Add event listener for each button
            document.querySelectorAll(".lesson-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const levelNo = this.getAttribute("data-level");
                    console.log("Fetching data for Level No:", levelNo);
                    document.getElementById('select-lekha-div').classList.add('hidden');

                    // Fetch level-specific data
                    fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data || !data.data || !Array.isArray(data.data)) {
                                console.error("No data found in API response");
                                const noDataMessageDiv = document.getElementById('no-data-message');
                                if (noDataMessageDiv) {
                                    noDataMessageDiv.classList.remove('hidden');
                                    noDataMessageDiv.innerHTML = '<p>No data found</p>';
                                } else {
                                    console.error('no-data-message element not found');
                                }
                                return;
                            }

                            const wordList = data.data.map(word => {
                                return `
                                    <div class="word-card text-center bg-gray-50 rounded-lg p-5 text-2xl">
                                        <h3 class="text-center font-bold text-3xl mb-2">${word.word}</h3>
                                        <p class="mb-2">Meaning/Pronunciation</p>
                                        <p class="mb-2">${word.meaning || "N/A"}/ ${word.pronunciation || "N/A"}</p>
                                        <div class="flex justify-between px-5 items-center">
                                        <div><button class="synonym-btn"><i class="fa-solid fa-circle-info"></i></button></div>
                                        <div><button class="example-btn"><i class="fa-solid fa-bullhorn"></i></button></div>
                                        </div>

                                    </div>
                                `;
                            }).join("");

                            // Ensure that word-list element exists
                            const wordListContainer = document.getElementById('word-list');
                            if (wordListContainer) {
                                wordListContainer.innerHTML = wordList;
                            } else {
                                console.error('word-list element not found');
                            }

                            document.querySelectorAll('.synonym-btn').forEach((btn, index) => {
                                btn.addEventListener('click', () => {
                                    const word = data.data[index];
                                    alert(`Synonyms: ${word.synonyms ? word.synonyms.join(", ") : "No synonyms available"}`);
                                });
                            });

                            document.querySelectorAll('.example-btn').forEach((btn, index) => {
                                btn.addEventListener('click', () => {
                                    const word = data.data[index];
                                    alert(`Example: ${word.example || "No example available"}`);
                                });
                            });
                        })
                        .catch(error => {
                            console.error("Error fetching data:", error);
                        });
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});
