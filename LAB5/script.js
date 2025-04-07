// Основной объект приложения
const ExhibitionApp = {
    // Массив для хранения компаний
    companies: [],
    
    // Инициализация приложения
    init() {
        // Загрузка данных из localStorage
        this.loadData();
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Обновление интерфейса
        this.updateUI();
    },
    
    // Загрузка данных из localStorage
    loadData() {
        const savedData = localStorage.getItem('exhibitionCompanies');
        if (savedData) {
            this.companies = JSON.parse(savedData);
        }
    },
    
    // Сохранение данных в localStorage
    saveData() {
        localStorage.setItem('exhibitionCompanies', JSON.stringify(this.companies));
    },
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопка сохранения
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCompany());
        
        // Кнопка очистки
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        
        // Кнопка редактирования
        document.getElementById('editBtn').addEventListener('click', () => this.editCompany());
        
        // Кнопка удаления
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteCompany());
        
        // Кнопка сортировки
        document.getElementById('sortBtn').addEventListener('click', () => this.sortByProductCount());
        
        // Кнопка добавления свойства
        document.getElementById('addPropertyBtn').addEventListener('click', () => this.addProperty());
        
        // Кнопка удаления свойства
        document.getElementById('removePropertyBtn').addEventListener('click', () => this.removeProperty());
        
        // Выбор компании из списка
        document.getElementById('existingCompanies').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadCompanyToForm(e.target.value);
            }
        });
    },
    
    // Сохранение компании
    saveCompany() {
        const form = document.getElementById('companyForm');
        const idInput = document.getElementById('companyId');
        
        const companyData = {
            id: idInput.value || Date.now().toString(),
            name: document.getElementById('companyName').value,
            country: document.getElementById('country').value,
            email: document.getElementById('email').value,
            productCount: parseInt(document.getElementById('productCount').value),
            additionalProperties: {}
        };
        
        // Проверка заполнения обязательных полей
        if (!companyData.name || !companyData.country || !companyData.email || isNaN(companyData.productCount)) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Поиск существующей компании для обновления
        const existingIndex = this.companies.findIndex(c => c.id === companyData.id);
        
        if (existingIndex >= 0) {
            // Сохраняем дополнительные свойства при обновлении
            companyData.additionalProperties = this.companies[existingIndex].additionalProperties || {};
            this.companies[existingIndex] = companyData;
        } else {
            this.companies.push(companyData);
        }
        
        // Сохранение данных и обновление интерфейса
        this.saveData();
        this.updateUI();
        this.clearForm();
        
        alert('Компания сохранена успешно!');
    },
    
    // Загрузка компании в форму для редактирования
    loadCompanyToForm(id) {
        const company = this.companies.find(c => c.id === id);
        if (!company) return;
        
        document.getElementById('companyId').value = company.id;
        document.getElementById('companyName').value = company.name;
        document.getElementById('country').value = company.country;
        document.getElementById('email').value = company.email;
        document.getElementById('productCount').value = company.productCount;
        
        // Отображение дополнительных свойств
        const propertyDisplay = document.getElementById('propertyDisplay');
        if (company.additionalProperties && Object.keys(company.additionalProperties).length > 0) {
            propertyDisplay.innerHTML = '<strong>Дополнительные свойства:</strong><br>' + 
                Object.entries(company.additionalProperties)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('<br>');
        } else {
            propertyDisplay.textContent = 'Нет дополнительных свойств';
        }
    },
    
    // Редактирование компании
    editCompany() {
        const select = document.getElementById('existingCompanies');
        if (!select.value) {
            alert('Пожалуйста, выберите компанию для редактирования');
            return;
        }
        
        this.loadCompanyToForm(select.value);
    },
    
    // Удаление компании
    deleteCompany() {
        const select = document.getElementById('existingCompanies');
        if (!select.value) {
            alert('Пожалуйста, выберите компанию для удаления');
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить эту компанию?')) {
            this.companies = this.companies.filter(c => c.id !== select.value);
            this.saveData();
            this.updateUI();
            this.clearForm();
            alert('Компания удалена успешно!');
        }
    },
    
    // Очистка формы
    clearForm() {
        document.getElementById('companyForm').reset();
        document.getElementById('companyId').value = '';
        document.getElementById('propertyValue').value = '';
        document.getElementById('propertyDisplay').textContent = '';
    },
    
    // Сортировка стран по количеству продукции
    sortByProductCount() {
        const sorted = [...this.companies]
            .sort((a, b) => b.productCount - a.productCount)
            .map(c => `${c.country}: ${c.productCount} единиц продукции`);
        
        document.getElementById('sortedCountries').innerHTML = 
            `<h4>Страны по количеству продукции:</h4><ul>${
                sorted.map(item => `<li>${item}</li>`).join('')
            }</ul>`;
    },
    
    // Добавление нового свойства
    addProperty() {
        const propertySelect = document.getElementById('propertySelect');
        const propertyValue = document.getElementById('propertyValue').value;
        const companyId = document.getElementById('companyId').value;
        
        if (!propertySelect.value || !propertyValue) {
            alert('Пожалуйста, выберите свойство и введите значение');
            return;
        }
        
        if (!companyId) {
            alert('Пожалуйста, выберите компанию для добавления свойства');
            return;
        }
        
        const company = this.companies.find(c => c.id === companyId);
        if (company) {
            company.additionalProperties = company.additionalProperties || {};
            company.additionalProperties[propertySelect.value] = propertyValue;
            this.saveData();
            this.updateUI();
            this.loadCompanyToForm(companyId);
        }
    },
    
    // Удаление свойства
    removeProperty() {
        const propertySelect = document.getElementById('propertySelect');
        const companyId = document.getElementById('companyId').value;
        
        if (!propertySelect.value) {
            alert('Пожалуйста, выберите свойство для удаления');
            return;
        }
        
        if (!companyId) {
            alert('Пожалуйста, выберите компанию для удаления свойства');
            return;
        }
        
        const company = this.companies.find(c => c.id === companyId);
        if (company && company.additionalProperties && company.additionalProperties[propertySelect.value]) {
            delete company.additionalProperties[propertySelect.value];
            this.saveData();
            this.updateUI();
            this.loadCompanyToForm(companyId);
            alert(`Свойство "${propertySelect.value}" удалено`);
        } else {
            alert('У выбранной компании нет такого свойства');
        }
    },
    
    // Обновление пользовательского интерфейса
    updateUI() {
        // Обновление таблицы
        const tableBody = document.querySelector('#companiesTable tbody');
        tableBody.innerHTML = this.companies.map(company => `
            <tr>
                <td>${company.id}</td>
                <td>${company.name}</td>
                <td>${company.country}</td>
                <td>${company.email}</td>
                <td>${company.productCount}</td>
                <td>${
                    company.additionalProperties 
                        ? Object.entries(company.additionalProperties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ') 
                        : ''
                }</td>
            </tr>
        `).join('');
        
        // Обновление выпадающего списка компаний
        const select = document.getElementById('existingCompanies');
        select.innerHTML = '<option value="">-- Выберите компанию --</option>' + 
            this.companies.map(company => 
                `<option value="${company.id}">${company.name} (${company.country})</option>`
            ).join('');
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => ExhibitionApp.init());