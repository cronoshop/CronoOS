// Clock App JavaScript - One UI OS

let alarms = [];
let timerInterval = null;
let timerDuration = 0;
let timerRemaining = 0;
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchLaps = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeClockApp();
    loadAlarms();
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000);
});

function initializeClockApp() {
    generateSampleAlarms();
    updateAlarmsDisplay();
    
    console.log('Clock app initialized');
}

function generateSampleAlarms() {
    alarms = [
        {
            id: 1,
            time: '07:00',
            label: 'Sveglia mattutina',
            days: [1, 2, 3, 4, 5], // Monday to Friday
            enabled: true,
            sound: 'default'
        },
        {
            id: 2,
            time: '22:30',
            label: 'Ora di dormire',
            days: [0, 1, 2, 3, 4, 5, 6], // Every day
            enabled: false,
            sound: 'gentle'
        }
    ];
}

function updateAlarmsDisplay() {
    const alarmsList = document.querySelector('.alarms-list');
    if (!alarmsList) return;
    
    alarmsList.innerHTML = '';
    
    alarms.forEach(alarm => {
        const alarmElement = createAlarmElement(alarm);
        alarmsList.appendChild(alarmElement);
    });
}

function createAlarmElement(alarm) {
    const element = document.createElement('div');
    element.className = 'alarm-item';
    
    const daysText = formatAlarmDays(alarm.days);
    
    element.innerHTML = `
        <div class="alarm-info">
            <div class="alarm-time">${alarm.time}</div>
            <div class="alarm-label">${alarm.label}</div>
            <div class="alarm-days">${daysText}</div>
        </div>
        <div class="alarm-toggle">
            <input type="checkbox" id="alarm${alarm.id}" ${alarm.enabled ? 'checked' : ''} 
                   onchange="toggleAlarm(${alarm.id})">
            <label for="alarm${alarm.id}" class="toggle-switch"></label>
        </div>
    `;
    
    // Add click handler for editing
    element.addEventListener('click', function(e) {
        if (!e.target.matches('input, label')) {
            editAlarm(alarm.id);
        }
    });
    
    return element;
}

function formatAlarmDays(days) {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    
    if (days.length === 7) {
        return 'Tutti i giorni';
    } else if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) {
        return 'Lun, Mar, Mer, Gio, Ven';
    } else if (days.length === 2 && days.includes(0) && days.includes(6)) {
        return 'Weekend';
    } else {
        return days.map(d => dayNames[d]).join(', ');
    }
}

function toggleAlarm(alarmId) {
    const alarm = alarms.find(a => a.id === alarmId);
    if (alarm) {
        alarm.enabled = !alarm.enabled;
        saveAlarms();
        
        const status = alarm.enabled ? 'attivata' : 'disattivata';
        showToast(`Sveglia ${status}`);
        hapticFeedback('light');
    }
}

function addAlarm() {
    showAlarmEditor();
}

function showAlarmEditor(alarmId = null) {
    const alarm = alarmId ? alarms.find(a => a.id === alarmId) : null;
    const isEdit = !!alarm;
    
    const editorModal = document.createElement('div');
    editorModal.className = 'alarm-editor-modal';
    editorModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${isEdit ? 'Modifica Sveglia' : 'Nuova Sveglia'}</h3>
                <button onclick="closeAlarmEditor()">×</button>
            </div>
            <div class="alarm-editor-content">
                <div class="time-picker-section">
                    <label>Ora</label>
                    <div class="time-picker">
                        <input type="time" id="alarmTime" value="${alarm?.time || '07:00'}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Etichetta</label>
                    <input type="text" id="alarmLabel" value="${alarm?.label || ''}" placeholder="Sveglia">
                </div>
                
                <div class="days-selector">
                    <label>Ripeti</label>
                    <div class="days-grid">
                        ${['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day, index) => `
                            <button class="day-btn ${alarm?.days.includes(index) ? 'active' : ''}" 
                                    onclick="toggleDay(${index})" data-day="${index}">
                                ${day}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Suono</label>
                    <select id="alarmSound">
                        <option value="default" ${alarm?.sound === 'default' ? 'selected' : ''}>Predefinito</option>
                        <option value="gentle" ${alarm?.sound === 'gentle' ? 'selected' : ''}>Dolce</option>
                        <option value="loud" ${alarm?.sound === 'loud' ? 'selected' : ''}>Forte</option>
                        <option value="nature" ${alarm?.sound === 'nature' ? 'selected' : ''}>Natura</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                ${isEdit ? '<button class="btn-secondary" onclick="deleteAlarm(' + alarmId + ')">Elimina</button>' : ''}
                <button class="btn-secondary" onclick="closeAlarmEditor()">Annulla</button>
                <button class="btn-primary" onclick="saveAlarm(${alarmId || 'null'})">${isEdit ? 'Aggiorna' : 'Salva'}</button>
            </div>
        </div>
    `;
    
    editorModal.style.cssText = `
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
    
    document.body.appendChild(editorModal);
}

function closeAlarmEditor() {
    const editorModal = document.querySelector('.alarm-editor-modal');
    if (editorModal) {
        editorModal.remove();
    }
}

function toggleDay(dayIndex) {
    const dayBtn = document.querySelector(`[data-day="${dayIndex}"]`);
    if (dayBtn) {
        dayBtn.classList.toggle('active');
    }
}

function saveAlarm(alarmId) {
    const time = document.getElementById('alarmTime')?.value;
    const label = document.getElementById('alarmLabel')?.value || 'Sveglia';
    const sound = document.getElementById('alarmSound')?.value || 'default';
    
    // Get selected days
    const selectedDays = [];
    document.querySelectorAll('.day-btn.active').forEach(btn => {
        selectedDays.push(parseInt(btn.dataset.day));
    });
    
    if (!time) {
        showToast('Seleziona un orario');
        return;
    }
    
    if (selectedDays.length === 0) {
        showToast('Seleziona almeno un giorno');
        return;
    }
    
    if (alarmId) {
        // Update existing alarm
        const alarm = alarms.find(a => a.id === alarmId);
        if (alarm) {
            alarm.time = time;
            alarm.label = label;
            alarm.days = selectedDays;
            alarm.sound = sound;
        }
    } else {
        // Create new alarm
        const newAlarm = {
            id: Date.now(),
            time: time,
            label: label,
            days: selectedDays,
            enabled: true,
            sound: sound
        };
        alarms.push(newAlarm);
    }
    
    updateAlarmsDisplay();
    saveAlarms();
    closeAlarmEditor();
    
    showToast(alarmId ? 'Sveglia aggiornata' : 'Sveglia creata');
    hapticFeedback('medium');
}

function editAlarm(alarmId) {
    showAlarmEditor(alarmId);
}

function deleteAlarm(alarmId) {
    if (!confirm('Eliminare questa sveglia?')) {
        return;
    }
    
    alarms = alarms.filter(a => a.id !== alarmId);
    updateAlarmsDisplay();
    saveAlarms();
    closeAlarmEditor();
    
    showToast('Sveglia eliminata');
    hapticFeedback('medium');
}

// Timer Functions
function startTimer() {
    const hours = parseInt(document.getElementById('timerHours')?.value) || 0;
    const minutes = parseInt(document.getElementById('timerMinutes')?.value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds')?.value) || 0;
    
    timerDuration = hours * 3600 + minutes * 60 + seconds;
    
    if (timerDuration === 0) {
        showToast('Imposta un tempo per il timer');
        return;
    }
    
    timerRemaining = timerDuration;
    
    // Update UI
    document.getElementById('startTimerBtn').style.display = 'none';
    document.getElementById('pauseTimerBtn').style.display = 'inline-block';
    document.getElementById('resetTimerBtn').style.display = 'inline-block';
    
    // Start countdown
    timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();
        
        if (timerRemaining <= 0) {
            timerFinished();
        }
    }, 1000);
    
    showToast('Timer avviato');
    hapticFeedback('medium');
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Update UI
    document.getElementById('startTimerBtn').style.display = 'inline-block';
    document.getElementById('startTimerBtn').textContent = 'Riprendi';
    document.getElementById('pauseTimerBtn').style.display = 'none';
    
    showToast('Timer in pausa');
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRemaining = 0;
    
    // Update UI
    document.getElementById('startTimerBtn').style.display = 'inline-block';
    document.getElementById('startTimerBtn').textContent = 'Avvia';
    document.getElementById('pauseTimerBtn').style.display = 'none';
    document.getElementById('resetTimerBtn').style.display = 'none';
    
    updateTimerDisplay();
    showToast('Timer resettato');
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        const hours = Math.floor(timerRemaining / 3600);
        const minutes = Math.floor((timerRemaining % 3600) / 60);
        const seconds = timerRemaining % 60;
        
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function timerFinished() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Reset UI
    resetTimer();
    
    // Show notification
    showTimerNotification();
    
    // Play sound and vibrate
    hapticFeedback('heavy');
    showToast('Timer terminato!');
}

function showTimerNotification() {
    const notification = document.createElement('div');
    notification.className = 'timer-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">⏰</div>
            <div class="notification-text">
                <h3>Timer Terminato!</h3>
                <p>Il tempo è scaduto</p>
            </div>
            <button onclick="dismissTimerNotification()">OK</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto dismiss after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            dismissTimerNotification();
        }
    }, 10000);
}

function dismissTimerNotification() {
    const notification = document.querySelector('.timer-notification');
    if (notification) {
        notification.remove();
    }
}

// Stopwatch Functions
function startStopwatch() {
    if (stopwatchInterval) return;
    
    stopwatchInterval = setInterval(() => {
        stopwatchTime++;
        updateStopwatchDisplay();
    }, 10); // Update every 10ms for precision
    
    // Update UI
    document.getElementById('startStopwatchBtn').style.display = 'none';
    document.getElementById('lapBtn').style.display = 'inline-block';
    document.getElementById('pauseStopwatchBtn').style.display = 'inline-block';
    
    showToast('Cronometro avviato');
    hapticFeedback('light');
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    
    // Update UI
    document.getElementById('startStopwatchBtn').style.display = 'inline-block';
    document.getElementById('startStopwatchBtn').textContent = 'Riprendi';
    document.getElementById('lapBtn').style.display = 'none';
    document.getElementById('pauseStopwatchBtn').style.display = 'none';
    document.getElementById('resetStopwatchBtn').style.display = 'inline-block';
    
    showToast('Cronometro in pausa');
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    stopwatchLaps = [];
    
    // Update UI
    document.getElementById('startStopwatchBtn').style.display = 'inline-block';
    document.getElementById('startStopwatchBtn').textContent = 'Avvia';
    document.getElementById('lapBtn').style.display = 'none';
    document.getElementById('pauseStopwatchBtn').style.display = 'none';
    document.getElementById('resetStopwatchBtn').style.display = 'none';
    
    updateStopwatchDisplay();
    updateLapsDisplay();
    showToast('Cronometro resettato');
}

function addLap() {
    if (!stopwatchInterval) return;
    
    const lapTime = stopwatchTime;
    const lapNumber = stopwatchLaps.length + 1;
    
    stopwatchLaps.unshift({
        number: lapNumber,
        time: lapTime,
        timestamp: Date.now()
    });
    
    updateLapsDisplay();
    hapticFeedback('light');
}

function updateStopwatchDisplay() {
    const display = document.getElementById('stopwatchDisplay');
    const msDisplay = document.getElementById('stopwatchMs');
    
    if (display && msDisplay) {
        const totalMs = stopwatchTime * 10;
        const hours = Math.floor(totalMs / 3600000);
        const minutes = Math.floor((totalMs % 3600000) / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        msDisplay.textContent = milliseconds.toString().padStart(2, '0');
    }
}

function updateLapsDisplay() {
    const lapsList = document.getElementById('lapsList');
    if (!lapsList) return;
    
    lapsList.innerHTML = '';
    
    stopwatchLaps.forEach(lap => {
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-item';
        
        const totalMs = lap.time * 10;
        const hours = Math.floor(totalMs / 3600000);
        const minutes = Math.floor((totalMs % 3600000) / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        
        lapElement.innerHTML = `
            <div class="lap-number">Giro ${lap.number}</div>
            <div class="lap-time">${timeString}</div>
        `;
        
        lapsList.appendChild(lapElement);
    });
}

// World Clock Functions
function updateWorldClocks() {
    const now = new Date();
    
    // Milan (local time)
    const milanTime = document.getElementById('milanTime');
    if (milanTime) {
        milanTime.textContent = now.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Europe/Rome'
        });
    }
    
    // New York
    const nyTime = document.getElementById('nyTime');
    if (nyTime) {
        nyTime.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/New_York'
        });
    }
    
    // Tokyo
    const tokyoTime = document.getElementById('tokyoTime');
    if (tokyoTime) {
        tokyoTime.textContent = now.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Tokyo'
        });
    }
    
    // London
    const londonTime = document.getElementById('londonTime');
    if (londonTime) {
        londonTime.textContent = now.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/London'
        });
    }
}

function addWorldClock() {
    showToast('Aggiungi fuso orario - Funzionalità in arrivo!');
}

// Storage Functions
function saveAlarms() {
    localStorage.setItem('clock_alarms', JSON.stringify(alarms));
}

function loadAlarms() {
    const saved = localStorage.getItem('clock_alarms');
    if (saved) {
        alarms = JSON.parse(saved);
        updateAlarmsDisplay();
    }
}

// Alarm checking (would run in background in a real app)
function checkAlarms() {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDay = now.getDay();
    
    alarms.forEach(alarm => {
        if (alarm.enabled && 
            alarm.time === currentTime && 
            alarm.days.includes(currentDay)) {
            triggerAlarm(alarm);
        }
    });
}

function triggerAlarm(alarm) {
    const alarmNotification = document.createElement('div');
    alarmNotification.className = 'alarm-notification';
    alarmNotification.innerHTML = `
        <div class="alarm-content">
            <div class="alarm-icon">⏰</div>
            <div class="alarm-info">
                <h3>${alarm.label}</h3>
                <p>${alarm.time}</p>
            </div>
            <div class="alarm-actions">
                <button onclick="snoozeAlarm(${alarm.id})">Posticipa</button>
                <button onclick="dismissAlarm(${alarm.id})">Disattiva</button>
            </div>
        </div>
    `;
    
    alarmNotification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(alarmNotification);
    
    // Vibrate and show toast
    hapticFeedback('heavy');
    showToast(`Sveglia: ${alarm.label}`);
}

function snoozeAlarm(alarmId) {
    // Snooze for 5 minutes
    showToast('Sveglia posticipata di 5 minuti');
    dismissAlarm(alarmId);
}

function dismissAlarm(alarmId) {
    const alarmNotification = document.querySelector('.alarm-notification');
    if (alarmNotification) {
        alarmNotification.remove();
    }
}

// Check alarms every minute
setInterval(checkAlarms, 60000);

// Add CSS for clock-specific styles
const clockStyles = document.createElement('style');
clockStyles.textContent = `
    .alarm-editor-modal .modal-content {
        max-width: 400px;
        width: 90%;
    }
    
    .time-picker-section {
        margin-bottom: 24px;
    }
    
    .time-picker input[type="time"] {
        font-size: 24px;
        padding: 16px;
        text-align: center;
        width: 100%;
        border: 2px solid var(--divider-color);
        border-radius: 12px;
        background: var(--surface-color);
    }
    
    .days-selector {
        margin-bottom: 24px;
    }
    
    .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin-top: 12px;
    }
    
    .day-btn {
        background: var(--surface-color);
        border: 2px solid var(--divider-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-primary);
    }
    
    .day-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
    }
    
    .day-btn:hover {
        background: var(--divider-color);
    }
    
    .day-btn.active:hover {
        background: var(--primary-dark);
    }
    
    .timer-notification,
    .alarm-notification {
        backdrop-filter: blur(10px);
    }
    
    .notification-content,
    .alarm-content {
        background: var(--card-color);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        max-width: 300px;
        width: 90%;
        box-shadow: 0 8px 32px var(--shadow-color);
    }
    
    .notification-icon,
    .alarm-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }
    
    .notification-text h3,
    .alarm-info h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
        font-size: 20px;
    }
    
    .notification-text p,
    .alarm-info p {
        margin: 0 0 24px 0;
        color: var(--text-secondary);
    }
    
    .notification-content button,
    .alarm-actions button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 16px;
        cursor: pointer;
        margin: 0 8px;
        transition: background-color 0.2s ease;
    }
    
    .notification-content button:hover,
    .alarm-actions button:hover {
        background: var(--primary-dark);
    }
    
    .alarm-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
    }
    
    .alarm-actions button:first-child {
        background: var(--text-secondary);
    }
    
    .alarm-actions button:first-child:hover {
        background: var(--text-primary);
    }
`;

document.head.appendChild(clockStyles);