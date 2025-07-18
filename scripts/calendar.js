// Calendar App JavaScript - CronoOS 2.3

let currentDate = new Date();
let selectedDate = new Date();
let events = [];
let selectedEventColor = '#0A84FF';

const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendarApp();
    loadEvents();
    renderCalendar();
    updateEventsForSelectedDate();
    setupEventListeners();
});

function initializeCalendarApp() {
    console.log('Calendar app initialized');
    
    // Set today as selected date
    selectedDate = new Date();
    
    // Update header
    updateHeader();
}

function loadEvents() {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('cronos_calendar_events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    } else {
        // Add some sample events
        events = generateSampleEvents();
        saveEvents();
    }
}

function generateSampleEvents() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
        {
            id: 1,
            title: 'Riunione di lavoro',
            date: today.toISOString().split('T')[0],
            time: '10:00',
            description: 'Riunione settimanale del team',
            color: '#0A84FF'
        },
        {
            id: 2,
            title: 'Pranzo con amici',
            date: today.toISOString().split('T')[0],
            time: '13:00',
            description: 'Pranzo al ristorante nuovo',
            color: '#30D158'
        },
        {
            id: 3,
            title: 'Appuntamento medico',
            date: tomorrow.toISOString().split('T')[0],
            time: '15:30',
            description: 'Controllo di routine',
            color: '#FF453A'
        },
        {
            id: 4,
            title: 'Compleanno di Marco',
            date: nextWeek.toISOString().split('T')[0],
            time: '19:00',
            description: 'Festa a casa sua',
            color: '#FF9500'
        }
    ];
}

function saveEvents() {
    localStorage.setItem('cronos_calendar_events', JSON.stringify(events));
}

function setupEventListeners() {
    // Navigation
    document.getElementById('prevMonthBtn').addEventListener('click', previousMonth);
    document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    
    // Add event
    document.getElementById('addEventBtn').addEventListener('click', openAddEventModal);
    
    // Modal controls
    document.getElementById('closeEventModal').addEventListener('click', closeAddEventModal);
    document.getElementById('cancelEventBtn').addEventListener('click', closeAddEventModal);
    document.getElementById('saveEventBtn').addEventListener('click', saveEvent);
    
    // Event details modal
    document.getElementById('closeDetailsModal').addEventListener('click', closeEventDetailsModal);
    document.getElementById('editEventBtn').addEventListener('click', editEvent);
    document.getElementById('deleteEventBtn').addEventListener('click', deleteEvent);
    
    // Color picker
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => selectColor(btn.dataset.color));
    });
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
}

function updateHeader() {
    const currentMonth = document.getElementById('currentMonth');
    const monthName = document.getElementById('monthName');
    const yearName = document.getElementById('yearName');
    
    const monthStr = monthNames[currentDate.getMonth()];
    const yearStr = currentDate.getFullYear().toString();
    
    currentMonth.textContent = `${monthStr} ${yearStr}`;
    monthName.textContent = monthStr;
    yearName.textContent = yearStr;
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(date, month);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(date, currentMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    const isCurrentMonth = date.getMonth() === currentMonth;
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDate);
    
    if (!isCurrentMonth) {
        dayDiv.classList.add('other-month');
    }
    
    if (isToday) {
        dayDiv.classList.add('today');
    }
    
    if (isSelected) {
        dayDiv.classList.add('selected');
    }
    
    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayDiv.appendChild(dayNumber);
    
    // Events for this day
    const dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';
    
    const dateStr = date.toISOString().split('T')[0];
    const dayEventsList = events.filter(event => event.date === dateStr);
    
    dayEventsList.slice(0, 3).forEach(event => {
        const eventDot = document.createElement('div');
        eventDot.className = 'event-dot';
        eventDot.style.background = event.color;
        eventDot.textContent = event.title;
        dayEvents.appendChild(eventDot);
    });
    
    if (dayEventsList.length > 3) {
        const moreDot = document.createElement('div');
        moreDot.className = 'event-dot small';
        moreDot.style.background = '#8A8A8E';
        dayEvents.appendChild(moreDot);
    }
    
    dayDiv.appendChild(dayEvents);
    
    // Click handler
    dayDiv.addEventListener('click', () => selectDate(date));
    
    return dayDiv;
}

function selectDate(date) {
    selectedDate = new Date(date);
    renderCalendar();
    updateEventsForSelectedDate();
}

function updateEventsForSelectedDate() {
    const eventsList = document.getElementById('eventsList');
    const eventsCount = document.getElementById('eventsCount');
    const eventsHeader = document.querySelector('.events-header h3');
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date === dateStr);
    
    // Update header
    const isToday = isSameDay(selectedDate, new Date());
    eventsHeader.textContent = isToday ? 'Eventi di oggi' : `Eventi del ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`;
    
    eventsCount.textContent = `${dayEvents.length} ${dayEvents.length === 1 ? 'evento' : 'eventi'}`;
    
    if (dayEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-check"></i>
                <p>Nessun evento per questo giorno</p>
            </div>
        `;
        return;
    }
    
    eventsList.innerHTML = '';
    dayEvents.forEach(event => {
        const eventElement = createEventElement(event);
        eventsList.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    eventDiv.style.borderLeftColor = event.color;
    eventDiv.dataset.eventId = event.id;
    
    eventDiv.innerHTML = `
        <div class="event-title">${event.title}</div>
        <div class="event-time">${event.time}</div>
        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
    `;
    
    eventDiv.addEventListener('click', () => openEventDetailsModal(event));
    
    return eventDiv;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateHeader();
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateHeader();
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    updateHeader();
    renderCalendar();
    updateEventsForSelectedDate();
}

function openAddEventModal() {
    const modal = document.getElementById('addEventModal');
    const eventDate = document.getElementById('eventDate');
    
    // Set default date to selected date
    eventDate.value = selectedDate.toISOString().split('T')[0];
    
    // Reset form
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventDescription').value = '';
    
    // Reset color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === '#0A84FF');
    });
    selectedEventColor = '#0A84FF';
    
    modal.classList.add('active');
}

function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.classList.remove('active');
}

function selectColor(color) {
    selectedEventColor = color;
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    
    if (!title || !date || !time) {
        showToast('Compila tutti i campi obbligatori');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        description,
        color: selectedEventColor
    };
    
    events.push(newEvent);
    saveEvents();
    
    // Update UI
    renderCalendar();
    updateEventsForSelectedDate();
    closeAddEventModal();
    
    showToast('Evento salvato!');
}

function openEventDetailsModal(event) {
    const modal = document.getElementById('eventDetailsModal');
    
    document.getElementById('eventDetailsTitle').textContent = event.title;
    
    const eventDate = new Date(event.date);
    document.getElementById('eventDetailsDate').textContent = eventDate.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('eventDetailsTime').textContent = event.time;
    
    const descriptionItem = document.getElementById('eventDetailsDescriptionItem');
    const descriptionSpan = document.getElementById('eventDetailsDescription');
    
    if (event.description) {
        descriptionSpan.textContent = event.description;
        descriptionItem.style.display = 'flex';
    } else {
        descriptionItem.style.display = 'none';
    }
    
    // Store event ID for edit/delete
    modal.dataset.eventId = event.id;
    
    modal.classList.add('active');
}

function closeEventDetailsModal() {
    const modal = document.getElementById('eventDetailsModal');
    modal.classList.remove('active');
}

function editEvent() {
    const modal = document.getElementById('eventDetailsModal');
    const eventId = parseInt(modal.dataset.eventId);
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Close details modal
    closeEventDetailsModal();
    
    // Open edit modal with event data
    const addModal = document.getElementById('addEventModal');
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventDescription').value = event.description || '';
    
    // Set color
    selectColor(event.color);
    
    // Change save button to update
    const saveBtn = document.getElementById('saveEventBtn');
    saveBtn.textContent = 'Aggiorna';
    saveBtn.onclick = () => updateEvent(eventId);
    
    addModal.classList.add('active');
}

function updateEvent(eventId) {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    
    if (!title || !date || !time) {
        showToast('Compila tutti i campi obbligatori');
        return;
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;
    
    events[eventIndex] = {
        ...events[eventIndex],
        title,
        date,
        time,
        description,
        color: selectedEventColor
    };
    
    saveEvents();
    
    // Reset save button
    const saveBtn = document.getElementById('saveEventBtn');
    saveBtn.textContent = 'Salva';
    saveBtn.onclick = saveEvent;
    
    // Update UI
    renderCalendar();
    updateEventsForSelectedDate();
    closeAddEventModal();
    
    showToast('Evento aggiornato!');
}

function deleteEvent() {
    const modal = document.getElementById('eventDetailsModal');
    const eventId = parseInt(modal.dataset.eventId);
    
    if (confirm('Eliminare questo evento?')) {
        events = events.filter(e => e.id !== eventId);
        saveEvents();
        
        // Update UI
        renderCalendar();
        updateEventsForSelectedDate();
        closeEventDetailsModal();
        
        showToast('Evento eliminato');
    }
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}