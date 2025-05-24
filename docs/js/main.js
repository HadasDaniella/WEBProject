document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupFadeInSections();
  FormSubmissionHandling();
  showCurrentDay();
  listSampleRecipes();
  setupIngredientForm();
  setupFileInputLabels();
  setupTermsModal();
});

// Handle mobile menu toggle
function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const navList = document.querySelector("nav ul");

  if (toggle && navList) {
    toggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }
}

// Use a for loop and IntersectionObserver to show sections on scroll
function setupFadeInSections() {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.classList.add("visible");
  });
}


// form submission handling for contact and recipe forms
function FormSubmissionHandling() {
  const forms = document.querySelectorAll("form");

  forms.forEach(form => {
    const submitBtn = form.querySelector("button[type='submit']");

    if (submitBtn) {
      form.addEventListener("submit", event => {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "שולח...";

        const formData = new FormData(form);

        fetch(form.action, {
          method: "POST",
          body: formData,
          redirect: "manual"
        })
          .then(() => {
            submitBtn.textContent ="הודעתך נשלחה בהצלחה!";
            form.reset();
          })
          .catch(error => {
            console.error("Form submission error:", error);
            submitBtn.textContent = "שגיאה בשליחה. נסו שוב.";
            submitBtn.disabled = false;
          });
      });
    }
  });
}

// Use switch statement to show current day on button click
function showCurrentDay() {
  const button = document.getElementById("show-day-btn");
  const output = document.getElementById("day-output");
  if (button && output) {
    button.addEventListener("click", () => {
      const dayNum = new Date().getDay();
      let day;
      switch (dayNum) {
        case 0: day = "Sunday"; break;
        case 1: day = "Monday"; break;
        case 2: day = "Tuesday"; break;
        case 3: day = "Wednesday"; break;
        case 4: day = "Thursday"; break;
        case 5: day = "Friday"; break;
        case 6: day = "Saturday"; break;
        default: day = "Unknown";
      }
      output.textContent = "Today is: " + day;
    });
  }
}

// Object with methods - display sample recipes
function listSampleRecipes() {
  const recipes = [
    {
      name: "Pizza",
      author: "Noa",
      display: function() {
        return `${this.name} by ${this.author}`;
      }
    },
    {
      name: "Shakshuka",
      author: "Avi",
      display: function() {
        return `${this.name} by ${this.author}`;
      }
    }
  ];

  const list = document.getElementById("recipe-list");
  if (list) {
    for (const recipe of recipes) {
      const li = document.createElement("li");
      li.textContent = recipe.display();
      list.appendChild(li);
    }
  }
  
}

// Handle dynamic addition/removal of ingredient rows
function setupIngredientForm() {
  const ingredientsContainer = document.getElementById('ingredients-container');
  const addIngredientBtn = document.getElementById('add-ingredient-btn');

  if (!ingredientsContainer || !addIngredientBtn) return;

  addIngredientBtn.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('ingredient-row');
    newRow.innerHTML = `
      <input type="text" name="quantity[]" placeholder="כמות" required>
      <input type="text" name="ingredient[]" placeholder="מרכיב" required>
      <button type="button" class="delete-btn" aria-label="מחק מרכיב">✕</button>
    `;
    ingredientsContainer.appendChild(newRow);
  });

  ingredientsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const rows = ingredientsContainer.querySelectorAll('.ingredient-row');
      if (rows.length > 1) {
        e.target.parentElement.remove();
      } else {
        alert('חייב להיות לפחות מרכיב אחד');
      }
    }
  });
}

// Update file input labels
function setupFileInputLabels() {
  const fallenPhoto = document.getElementById('fallen-photo');
  const fallenPhotoName = document.getElementById('fallen-photo-name');
  const dishPhoto = document.getElementById('dish-photo');
  const dishPhotoName = document.getElementById('dish-photo-name');

  if (fallenPhoto && fallenPhotoName) {
    fallenPhoto.addEventListener('change', function () {
      fallenPhotoName.textContent = this.files[0]?.name || 'לא נבחר קובץ';
    });
  }

  if (dishPhoto && dishPhotoName) {
    dishPhoto.addEventListener('change', function () {
      dishPhotoName.textContent = this.files[0]?.name || 'לא נבחר קובץ';
    });
  }
}

function setupTermsModal() {
  const openBtn = document.getElementById("open-terms-link");
  const modal = document.getElementById("termsModal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("close-modal");
  const termsText = document.getElementById("termsText");

  if (!openBtn || !modal || !overlay || !closeBtn || !termsText) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    fetch('terms.txt')
      .then(response => response.text())
      .then(data => {
        termsText.textContent = data;
      })
      .catch(error => {
        termsText.textContent = "שגיאה בטעינת תנאי השימוש.";
        console.error("Error loading terms:", error);
      });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}

function closeModal() {
  const modal = document.getElementById("termsModal");
  if (modal) modal.classList.add("hidden");
}

function handleFormSubmission(formId, successMessage) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(() => {
        const messageElement = document.getElementById('form-message');
        messageElement.textContent = successMessage;
        messageElement.style.display = 'block';
        messageElement.style.color = '#2e7d32';
        form.reset();
      })
      .catch(() => {
        const messageElement = document.getElementById('form-message');
        messageElement.textContent = 'אירעה שגיאה. נסה שוב מאוחר יותר.';
        messageElement.style.display = 'block';
        messageElement.style.color = '#c62828';
      });
  });
}

// apply logic for each form
handleFormSubmission('recipeForm', 'הטופס נשלח בהצלחה! תודה על השיתוף ❤️');
handleFormSubmission('contactForm', 'תודה על פנייתך, נציג יחזור אליך בהקדם.');

