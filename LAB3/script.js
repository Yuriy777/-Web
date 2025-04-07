// Глобальный объект переводов
const translations = {
    ru: {
        labels: ["Имя:", "Фамилия:", "Email:", "Телефон:"],
        placeholders: ["Введите имя", "Введите фамилию", "Введите email", "Введите телефон"]
    },
    en: {
        labels: ["Name:", "Surname:", "Email:", "Phone:"],
        placeholders: ["Enter name", "Enter surname", "Enter email", "Enter phone"]
    }
};

// Текущий язык
let currentLanguage = 'ru';

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация формы
    initForm();
    
    // Обработчик изменения стиля
    document.getElementById('styleSelector').addEventListener('change', applyStyle);
    
    // Назначаем обработчики кнопок
    document.querySelector('button[onclick="switchLanguage(\'ru\')"]').addEventListener('click', function() {
        switchLanguage('ru');
    });
    
    document.querySelector('button[onclick="switchLanguage(\'en\')"]').addEventListener('click', function() {
        switchLanguage('en');
    });
    
    document.querySelector('button[onclick="showLists()"]').addEventListener('click', showLists);
});

function initForm() {
    // Назначаем обработчики для автоматического перехода
    const fields = document.querySelectorAll('.text-field');
    fields.forEach((field, index, fieldsArray) => {
        field.addEventListener('input', function() {
            if (this.value.length >= 3 && index < fieldsArray.length - 1) {
                fieldsArray[index + 1].focus();
            }
        });
        
        // Добавляем плейсхолдеры
        field.placeholder = translations[currentLanguage].placeholders[index];
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    const labels = document.querySelectorAll('[id^="label"]');
    const fields = document.querySelectorAll('.text-field');
    
    // Обновляем метки
    labels.forEach((label, index) => {
        label.textContent = translations[lang].labels[index];
    });
    
    // Обновляем плейсхолдеры
    fields.forEach((field, index) => {
        field.placeholder = translations[lang].placeholders[index];
    });
    
    applyStyle();
}

function applyStyle() {
    const style = document.getElementById('styleSelector').value.split(', ');
    document.querySelectorAll('.text-field, label').forEach(el => {
        el.style.font = style[0];
        el.style.color = style[1];
    });
}

function showLists() {
    const labels = Array.from(document.querySelectorAll('[id^="label"]')).map(label => label.textContent);
    const values = Array.from(document.querySelectorAll('.text-field')).map(field => field.value || field.placeholder);
    
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Результаты формы</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #4CAF50; }
                ul { list-style-type: none; padding: 0; }
                li { padding: 8px; margin: 5px 0; background: #f9f9f9; border-left: 4px solid #4CAF50; }
            </style>
        </head>
        <body>
            <h2>Надписи:</h2>
            <ul>${labels.map(item => `<li>${item}</li>`).join('')}</ul>
            <h2>Введенные значения:</h2>
            <ul>${values.map(item => `<li>${item}</li>`).join('')}</ul>
        </body>
        </html>
    `);
    newWindow.document.close();
}