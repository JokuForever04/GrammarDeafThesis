function showPage(pageId) {
    // Hide all sections
    var sections = document.querySelectorAll('.section-content');
    sections.forEach(function(section) {
        section.classList.remove('show');
    });

    // Show the selected section
    var activeSection = document.getElementById(pageId);
    activeSection.classList.add('show');
}


// Accordion functionality
var acc = document.getElementsByClassName("home-accordion");
for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

// Scroll effect to add fade-in animation
window.addEventListener('scroll', function() {
    var elements = document.querySelectorAll('.home-fade-in');
    elements.forEach(function(el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});


/*GRAMMAR CHECKER*/
let cachedErrors = {};  
let isLoading = false;  

        function updateCharCount() {
            const text = document.getElementById('textInput').value;
            const charCount = document.getElementById('charCount');
            const charLimitWarning = document.getElementById('charLimitWarning');
            charCount.innerText = `Character count: ${text.length}`;

            if (text.length > 1000) {
                charLimitWarning.style.display = 'block';
            } else {
                charLimitWarning.style.display = 'none';
            }
        }

        function checkGrammar() {
            const text = document.getElementById('textInput').value;
            const errorMessages = document.getElementById('errorMessages');
            const noErrors = document.getElementById('noErrors');
            const button = document.getElementById('checkButton');

            errorMessages.innerHTML = '';  
            noErrors.style.display = 'none';  

            if (text.trim() === "") return;

            if (!isLoading) {
                button.innerHTML = 'Checking... <span class="grammar-loading-dot"></span>';
                button.disabled = true;
                isLoading = true;
            }

            if (cachedErrors[text] && (Date.now() - cachedErrors[text].timestamp < 60000)) {
                displayErrors(cachedErrors[text].matches);
                isLoading = false;
                button.disabled = false;
                button.innerHTML = 'Check Grammar';
                return;
            }

            fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    text: text,
                    language: 'en-US'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.matches.length === 0) {
                    noErrors.style.display = 'block';
                } else {
                    cachedErrors[text] = { matches: data.matches, timestamp: Date.now() };
                    displayErrors(data.matches);
                }
                isLoading = false;
                button.disabled = false;
                button.innerHTML = 'Check Grammar';
            })
            .catch(error => {
                console.error('Error checking grammar:', error);
                isLoading = false;
                button.disabled = false;
                button.innerHTML = 'Check Grammar';
                alert("An error occurred. Please try again.");
            });
        }

        function displayErrors(matches) {
            const errorMessages = document.getElementById('errorMessages');
            matches.forEach(match => {
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('grammar-error-message');
                errorDiv.innerHTML = `
                    <strong>${match.message}</strong> 
                    at position ${match.offset} for the word 
                    "<em>${match.context.text.slice(match.offset, match.offset + match.length)}</em>"
                `;

                const suggestionsDiv = document.createElement('div');
                match.replacements.forEach(replacement => {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.classList.add('grammar-suggestion-button');
                    suggestionDiv.innerText = `Try: ${replacement.value}`;
                    suggestionDiv.onclick = function () {
                        applyCorrection(match.offset, match.length, replacement.value);
                    };
                    suggestionsDiv.appendChild(suggestionDiv);
                });

                errorDiv.appendChild(suggestionsDiv);
                errorMessages.appendChild(errorDiv);
            });
        }

        function applyCorrection(offset, length, replacement) {
            const textArea = document.getElementById('textInput');
            const text = textArea.value;
            const newText = text.slice(0, offset) + replacement + text.slice(offset + length);
            textArea.value = newText;

            cachedErrors = {}; 
            setTimeout(() => { checkGrammar(); }, 500);
        }

        function clearText() {
            document.getElementById('textInput').value = '';
            document.getElementById('errorMessages').innerHTML = '';
            document.getElementById('noErrors').style.display = 'none';
            cachedErrors = {}; 
            document.getElementById('charCount').innerText = 'Character count: 0';
            document.getElementById('charLimitWarning').style.display = 'none';
        }


/*PARAPHRASE TOOL*/
        function rephraseText() {
            const inputText = document.getElementById('inputText').value;
            const rephraseOption = document.getElementById('rephraseOption').value;
            const outputText = document.getElementById('outputText');
            const loadingIndicator = document.getElementById('loading');
            const rephraseButton = document.getElementById('rephraseButton');

            if (inputText.trim() === "") {
                outputText.value = "Please enter some text to paraphrase.";
                return;
            }

            rephraseButton.disabled = true;
            loadingIndicator.style.display = 'block';
            outputText.value = "";

            setTimeout(() => {
                let rephrasedText = "";

                switch(rephraseOption) {
                    case "formal":
                        rephrasedText = `This is a more formal version: Dear Sir/Madam, ${inputText}`; break;
                    case "informal":
                        rephrasedText = `This is a more informal version: Hey, ${inputText}`; break;
                    case "shorter":
                        rephrasedText = `A shorter version: ${inputText.split(' ').slice(0, 5).join(' ')}...`; break;
                    case "longer":
                        rephrasedText = `A longer version: ${inputText} in greater detail, with additional context and elaboration.`; break;
                    case "fluent":
                        rephrasedText = `A more fluent version: I want to express this more naturally: ${inputText}`; break;
                    case "sensory":
                        rephrasedText = `With sensory details: The air was filled with the smell of fresh coffee, and the warm sunlight bathed the room as I thought about: ${inputText}`; break;
                    default:
                        rephrasedText = inputText;
                }

                loadingIndicator.style.display = 'none';
                outputText.value = rephrasedText;
                rephraseButton.disabled = false;
            }, 2000);
        }

        function clearText() {
            document.getElementById('inputText').value = "";
            document.getElementById('outputText').value = "";
        }


        // BLOG
        document.querySelectorAll('.blog-read-more').forEach(button => {
            button.addEventListener('click', () => {
                const fullPost = button.nextElementSibling;
                if (fullPost.style.display === 'none' || fullPost.style.display === '') {
                    fullPost.style.display = 'block';
                    button.textContent = 'Read Less';
                } else {
                    fullPost.style.display = 'none';
                    button.textContent = 'Read More';
                }
            });
        });


        // HELP CENTER
        function toggleAnswer(answerId, questionElement) {
            var answer = document.getElementById(answerId);
            var question = questionElement;

            // Toggle the answer visibility
            if (answer.classList.contains('show')) {
                answer.classList.remove('show');
                question.classList.remove('open');
            } else {
                answer.classList.add('show');
                question.classList.add('open');
            }
        }


        // CONTACTS
        function validateForm() {
            const name = document.getElementById("contacts-name").value;
            const email = document.getElementById("contacts-email").value;
            const message = document.getElementById("contacts-message").value;
            const loadingSpinner = document.getElementById("loadingSpinner");

            // Show loading spinner
            loadingSpinner.classList.add("show");

            // Simple form validation
            if (name === "" || email === "" || message === "") {
                alert("Please fill in all fields before submitting.");
                loadingSpinner.classList.remove("show");
                return false;  // Prevent form submission
            }

            // Check if email format is valid
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                loadingSpinner.classList.remove("show");
                return false;
            }

            // Simulate sending the form and hide loading spinner
            setTimeout(() => {
                alert("Your message has been sent!");
                loadingSpinner.classList.remove("show");
            }, 2000); // Simulate network delay

            return false;  // Prevent real form submission for demo purposes
        }


        // CONTACT US
    // Add submit event listener to the form
    document.getElementById('form').addEventListener('submit', function(event) {
      event.preventDefault();

      const btn = document.getElementById('button');
      const feedbackMessage = document.getElementById('feedback-message');
      btn.value = 'Sending...';  // Change button text while sending

      const serviceID = 'default_service';  // Your EmailJS service ID
      const templateID = 'template_uex8hvh'; // Your EmailJS template ID

      // Send the form data using EmailJS
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          btn.value = 'Send Message';  // Reset button text on success
          feedbackMessage.classList.remove('form-error-message');
          feedbackMessage.classList.add('form-success-message');
          feedbackMessage.style.display = 'block'; // Show success message
          feedbackMessage.innerHTML = '<p>Thank you! Your message has been sent successfully.</p>';
        }, (err) => {
          btn.value = 'Send Message';  // Reset button text on error
          feedbackMessage.classList.add('form-error-message');
          feedbackMessage.style.display = 'block';
          feedbackMessage.innerHTML = '<p>Error: Something went wrong. Please try again.</p>';
        });
    });

// ABOUT US
    console.log('Page Loaded');



    // PRIVACY POLICY
    function toggleVisibility(id) {
        const section = document.getElementById(id);
        section.classList.toggle('ppolicy-collapsed');
        section.classList.toggle('ppolicy-expanded');
    }
