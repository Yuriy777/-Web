document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const nameInput = document.getElementById('name');
    const activitiesCheckboxes = document.querySelectorAll('input[name="activities"]');
    const nameError = document.getElementById('nameError');
    const activitiesError = document.getElementById('activitiesError');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем обычную отправку формы
        let isValid = true;

        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Пожалуйста, введите ваше имя.';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        let isActivityChecked = false;
        const selectedActivities = [];
        activitiesCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                isActivityChecked = true;
                selectedActivities.push(checkbox.value);
            }
        });

        if (!isActivityChecked) {
            activitiesError.textContent = 'Пожалуйста, выберите хотя бы одну активность.';
            isValid = false;
        } else {
            activitiesError.textContent = '';
        }

        if (isValid) {
            const formData = {
                name: nameInput.value,
                visitTime: document.getElementById('visitTime').value,
                activities: selectedActivities,
                organizationRating: document.getElementById('organizationRating').value,
                firstTime: document.querySelector('input[name="firstTime"]:checked')?.value || ''
            };

            console.log('Данные перед сохранением в localStorage:', formData); // Добавили вывод в консоль
            localStorage.setItem('surveyData', JSON.stringify(formData));
            console.log('Данные сохранены в localStorage:', localStorage.getItem('surveyData')); // Добавили вывод в консоль
            window.location.href = 'results.html'; // Перенаправляем на results.html
        }
    });
});