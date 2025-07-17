// Calendar App JavaScript - One UI OS

let currentDate = new Date();
let events = [];
let selectedDate = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendarApp();
    loadEvents();
    generateCalendar();
    updateEventsDisplay();
});

function initializeCalendarApp() {
    updateMonthDisplay();
    generateSampleEvents();
    
    console.log('Calendar app initialized');
}

function generateSampleEvents() {
    const today = new Date();
    
    events = [
        {
            id: 1,
            title: 'Riunione di lavoro',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            time: '09:00',
            location: 'Ufficio',
            category: 'work',
            description: 'Riunione settimanale del team'
        },
        {
            id: 2,
            title: 'Pranzo con Marco',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            time: '14:30',
            location: 'Ristorante Centro',
            category: 'personal',
            description: 'Pranzo di lavoro'
        },
        {
            id: 3,
            title: 'Palestra',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            time: '18:00',
            location: 'Fitness Club',
            category: 'health',
            description: 'Allenamento serale'
        },
        {
            id: 4,
            title: 'Cena famiglia',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            time: '20:00',
            location: 'Casa',
            category: 'family',
            description: 'Cena domenicale'
        },
        {
            id: 5,
            title: 'Dentista',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
            time: '10:30',
            location: 'Studio Medico',
            category: 'health',
            description: 'Controllo semestrale'
        }
    ];
}

function updateMonthDisplay() {
    const currentMonth = document.getElementById('currentMonth');
    if (currentMonth) {
        const monthNames = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        
        currentMonth.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(year, month, day);
        calendarGrid.appendChild(dayElement);
    }
    
    // Fill remaining cells
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
}

function createDayElement(year, month, day) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const date = new Date(year, month, day);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
    }
    
    // Check if it's selected
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        dayElement.classList.add('selected');
    }
    
    // Add day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);
    
    // Add events for this day
    const dayEvents = events.filter(event => 
        event.date.toDateString() === date.toDateString()
    );
    
    if (dayEvents.length > 0) {
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        dayEvents.slice(0, 3).forEach(event => { // Show max 3 events
            const eventElement = document.createElement('div');
            eventElement.className = `day-event ${event.category}`;
            eventElement.textContent = event.title;
            eventsContainer.appendChild(eventElement);
        });
        
        if (dayEvents.length > 3) {
            const moreElement = document.createElement('div');
            moreElement.className = 'day-event';
            moreElement.textContent = `+${dayEvents.length - 3} altri`;
            eventsContainer.appendChild(moreElement);
        }
        
        dayElement.appendChild(eventsContainer);
    }
    
    // Add click handler
    dayElement.addEventListener('click', () => selectDate(date));
    
    return dayElement;
}

function selectDate(date) {
    selectedDate = date;
    generateCalendar();
    updateEventsDisplay();
    hapticFeedback('light');
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthDisplay();
    generateCalendar();
    hapticFeedback('light');
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();
    generateCalendar();
    hapticFeedback('light');
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    updateMonthDisplay();
    generateCalendar();
    updateEventsDisplay();
    hapticFeedback('medium');
}

function updateEventsDisplay() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    const displayDate = selectedDate || new Date();
    const dayEvents = events.filter(event => 
        event.date.toDateString() === displayDate.toDateString()
    );
    
    // Update section title
    const eventsSection = eventsList.closest('.events-section');
    if (eventsSection) {
        const title = eventsSection.querySelector('h3');
        if (title) {
            const isToday = displayDate.toDateString() === new Date().toDateString();
            const dateString = isToday ? 'oggi' : displayDate.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
            title.textContent = `Eventi di ${dateString}`;
        }
    }
    
    eventsList.innerHTML = '';
    
    if (dayEvents.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'no-events';
        noEvents.textContent = 'Nessun evento per questo giorno';
        noEvents.style.cssText = `
            text-align: center;
            color: var(--text-secondary);
            padding: 40px 20px;
            font-style: italic;
        `;
        eventsList.appendChild(noEvents);
        return;
    }
    
    // Sort events by time
    dayEvents.sort((a, b) => a.time.localeCompare(b.time));
    
    dayEvents.forEach(event => {
        const eventElement = createEventElement(event);
        eventsList.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const element = document.createElement('div');
    element.className = 'event-item';
    element.onclick = () => showEventDetails(event);
    
    element.innerHTML = `
        <div class="event-time">${event.time}</div>
        <div class="event-details">
            <div class="event-title">${event.title}</div>
            <div class="event-location">${event.location}</div>
        </div>
        <div class="event-color ${event.category}"></div>
    `;
    
    return element;
}

function showEventDetails(event) {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'event-details-modal';
    detailsModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Dettagli Evento</h3>
                <button onclick="closeEventDetails()">×</button>
            </div>
            <div class="event-details-content">
                <div class="event-category-badge ${event.category}">
                    ${getCategoryName(event.category)}
                </div>
                <h2>${event.title}</h2>
                <div class="event-info">
                    <div class="info-item">
                        <span class="info-icon">📅</span>
                        <span>${event.date.toLocaleDateString('it-IT', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🕐</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📍</span>
                        <span>${event.location}</span>
                    </div>
                </div>
                <div class="event-description">
                    <h4>Descrizione</h4>
                    <p>${event.description}</p>
                </div>
                <div class="event-actions">
                    <button class="btn-secondary" onclick="editEvent(${event.id})">Modifica</button>
                    <button class="btn-primary" onclick="deleteEvent(${event.id})">Elimina</button>
                </div>
            </div>
        </div>
    `;
    
    detailsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(detailsModal);
}

function closeEventDetails() {
    const detailsModal = document.querySelector('.event-details-modal');
    if (detailsModal) {
        detailsModal.remove();
    }
}

function getCategoryName(category) {
    const categories = {
        'work': 'Lavoro',
        'personal': 'Personale',
        'health': 'Salute',
        'family': 'Famiglia'
    };
    return categories[category] || category;
}

function addEvent() {
    openModal('addEventModal');
    
    // Set default date to selected date or today
    const eventDate = document.getElementById('eventDate');
    if (eventDate) {
        const defaultDate = selectedDate || new Date();
        eventDate.value = defaultDate.toISOString().split('T')[0];
    }
}

function closeAddEventModal() {
    closeModal('addEventModal');
    
    // Clear form
    const form = document.getElementById('addEventModal');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
}

function saveEvent() {
    const title = document.getElementById('eventTitle')?.value;
    const date = document.getElementById('eventDate')?.value;
    const time = document.getElementById('eventTime')?.value;
    const location = document.getElementById('eventLocation')?.value;
    const category = document.getElementById('eventCategory')?.value;
    
    if (!title || !date || !time) {
        showToast('Compila tutti i campi obbligatori');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        title: title,
        date: new Date(date),
        time: time,
        location: location || 'Non specificato',
        category: category || 'personal',
        description: `Evento creato il ${new Date().toLocaleDateString('it-IT')}`
    };
    
    events.push(newEvent);
    
    // Update displays
    generateCalendar();
    updateEventsDisplay();
    
    // Close modal
    closeAddEventModal();
    
    showToast('Evento aggiunto con successo');
    hapticFeedback('medium');
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Close details modal
    closeEventDetails();
    
    // Open edit modal (similar to add modal but pre-filled)
    openModal('addEventModal');
    
    // Fill form with event data
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date.toISOString().split('T')[0];
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventCategory').value = event.category;
    
    // Change save button to update
    const saveBtn = document.querySelector('#addEventModal .btn-primary');
    if (saveBtn) {
        saveBtn.textContent = 'Aggiorna';
        saveBtn.onclick = () => updateEvent(eventId);
    }
}

function updateEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const title = document.getElementById('eventTitle')?.value;
    const date = document.getElementById('eventDate')?.value;
    const time = document.getElementById('eventTime')?.value;
    const location = document.getElementById('eventLocation')?.value;
    const category = document.getElementById('eventCategory')?.value;
    
    if (!title || !date || !time) {
        showToast('Compila tutti i campi obbligatori');
        return;
    }
    
    // Update event
    event.title = title;
    event.date = new Date(date);
    event.time = time;
    event.location = location || 'Non specificato';
    event.category = category || 'personal';
    
    // Update displays
    generateCalendar();
    updateEventsDisplay();
    
    // Close modal
    closeAddEventModal();
    
    showToast('Evento aggiornato con successo');
    hapticFeedback('medium');
}

function deleteEvent(eventId) {
    if (!confirm('Sei sicuro di voler eliminare questo evento?')) {
        return;
    }
    
    events = events.filter(e => e.id !== eventId);
    
    // Update displays
    generateCalendar();
    updateEventsDisplay();
    
    // Close details modal
    closeEventDetails();
    
    showToast('Evento eliminato');
    hapticFeedback('medium');
}

function loadEvents() {
    // In a real app, this would load from storage
    const saved = localStorage.getItem('calendar_events');
    if (saved) {
        const savedEvents = JSON.parse(saved);
        events = savedEvents.map(event => ({
            ...event,
            date: new Date(event.date)
        }));
    }
}

function saveEvents() {
    localStorage.setItem('calendar_events', JSON.stringify(events));
}

// Save events whenever they change
function saveEventsToStorage() {
    saveEvents();
}

// Calendar navigation with keyboard
document.addEventListener('keydown', function(e) {
    if (!document.querySelector('.calendar-view')) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            previousMonth();
            break;
        case 'ArrowRight':
            nextMonth();
            break;
        case 'Home':
            goToToday();
            break;
        case 'Escape':
            const modal = document.querySelector('.modal.active');
            if (modal) {
                closeModal(modal.id);
            }
            break;
    }
});

// Week view functionality
function showWeekView() {
    const weekView = document.createElement('div');
    weekView.className = 'week-view';
    
    // Calculate week dates
    const startOfWeek = getStartOfWeek(selectedDate || new Date());
    const weekDates = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date);
    }
    
    weekView.innerHTML = `
        <div class="week-header">
            <button class="back-btn" onclick="closeWeekView()">←</button>
            <h3>Vista Settimanale</h3>
            <div class="week-navigation">
                <button onclick="previousWeek()">‹</button>
                <button onclick="nextWeek()">›</button>
            </div>
        </div>
        <div class="week-grid">
            ${weekDates.map(date => createWeekDayColumn(date)).join('')}
        </div>
    `;
    
    weekView.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 1500;
        animation: slideInUp 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(weekView);
}

function getStartOfWeek(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
}

function createWeekDayColumn(date) {
    const dayEvents = events.filter(event => 
        event.date.toDateString() === date.toDateString()
    );
    
    const isToday = date.toDateString() === new Date().toDateString();
    
    return `
        <div class="week-day-column ${isToday ? 'today' : ''}">
            <div class="week-day-header">
                <div class="week-day-name">${date.toLocaleDateString('it-IT', { weekday: 'short' })}</div>
                <div class="week-day-number">${date.getDate()}</div>
            </div>
            <div class="week-day-events">
                ${dayEvents.map(event => `
                    <div class="week-event ${event.category}" onclick="showEventDetails(${JSON.stringify(event).replace(/"/g, '&quot;')})">
                        <div class="week-event-time">${event.time}</div>
                        <div class="week-event-title">${event.title}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function closeWeekView() {
    const weekView = document.querySelector('.week-view');
    if (weekView) {
        weekView.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => weekView.remove(), 300);
    }
}

// Add CSS for calendar-specific styles
const calendarStyles = document.createElement('style');
calendarStyles.textContent = `
    .event-details-modal .modal-content {
        max-width: 500px;
        width: 90%;
    }
    
    .event-category-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 16px;
        color: white;
    }
    
    .event-category-badge.work { background: var(--oneui-blue); }
    .event-category-badge.personal { background: var(--oneui-green); }
    .event-category-badge.health { background: var(--oneui-orange); }
    .event-category-badge.family { background: var(--oneui-purple); }
    
    .event-details-content h2 {
        margin: 0 0 20px 0;
        color: var(--text-primary);
    }
    
    .event-info {
        margin-bottom: 20px;
    }
    
    .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        color: var(--text-primary);
    }
    
    .info-icon {
        font-size: 16px;
        width: 20px;
    }
    
    .event-description h4 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
        font-size: 16px;
    }
    
    .event-description p {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .event-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        justify-content: flex-end;
    }
    
    .week-view {
        display: flex;
        flex-direction: column;
    }
    
    .week-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: var(--card-color);
        border-bottom: 1px solid var(--divider-color);
    }
    
    .week-navigation {
        display: flex;
        gap: 8px;
    }
    
    .week-navigation button {
        background: var(--surface-color);
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        color: var(--text-primary);
    }
    
    .week-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        flex: 1;
        gap: 1px;
        background: var(--divider-color);
    }
    
    .week-day-column {
        background: var(--card-color);
        display: flex;
        flex-direction: column;
        min-height: 400px;
    }
    
    .week-day-column.today {
        background: rgba(25, 118, 210, 0.05);
    }
    
    .week-day-header {
        text-align: center;
        padding: 12px;
        border-bottom: 1px solid var(--divider-color);
        background: var(--surface-color);
    }
    
    .week-day-name {
        font-size: 12px;
        color: var(--text-secondary);
        text-transform: uppercase;
    }
    
    .week-day-number {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-primary);
        margin-top: 4px;
    }
    
    .week-day-events {
        flex: 1;
        padding: 8px;
    }
    
    .week-event {
        background: var(--surface-color);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        border-left: 3px solid var(--primary-color);
        transition: all 0.2s ease;
    }
    
    .week-event:hover {
        background: var(--divider-color);
        transform: translateX(2px);
    }
    
    .week-event.work { border-left-color: var(--oneui-blue); }
    .week-event.personal { border-left-color: var(--oneui-green); }
    .week-event.health { border-left-color: var(--oneui-orange); }
    .week-event.family { border-left-color: var(--oneui-purple); }
    
    .week-event-time {
        font-size: 11px;
        color: var(--text-secondary);
        margin-bottom: 2px;
    }
    
    .week-event-title {
        font-size: 12px;
        color: var(--text-primary);
        font-weight: 500;
    }
`;

document.head.appendChild(calendarStyles);