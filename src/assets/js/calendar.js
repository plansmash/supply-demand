/**
 * Dynamic Calendar for Supply & Demand Events
 * Generates calendar views for any month/year with recurring event support
 */

class EventCalendar {
  constructor(eventsData) {
    this.allEvents = eventsData;
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth(); // 0-11
    this.today = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
  
  /**
   * Get the number of days in a given month/year
   */
  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  /**
   * Get the day of week (0-6) for the first day of a given month/year
   */
  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }
  
  /**
   * Format a date as YYYY-MM-DD
   */
  formatDateISO(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }
  
  /**
   * Format a date for display (e.g., "January 16, 2026")
   */
  formatDateDisplay(year, month, day) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  /**
   * Check if a date is today
   */
  isToday(year, month, day) {
    return year === this.today.getFullYear() && 
           month === this.today.getMonth() && 
           day === this.today.getDate();
  }
  
  /**
   * Check if a date is in the future (including today)
   */
  isFutureDate(year, month, day) {
    const date = new Date(year, month, day);
    return date >= this.today;
  }
  
  /**
   * Calculate all dates for a recurring pattern in a given month/year
   * Pattern examples: "Every Monday", "3rd Wednesday", "First Friday"
   */
  getRecurringDates(pattern, year, month) {
    if (!pattern) return [];
    
    const patternLower = pattern.toLowerCase();
    const dates = [];
    const daysInMonth = this.getDaysInMonth(year, month);
    
    // Parse day of week from pattern
    let targetDay = -1;
    for (let i = 0; i < this.dayNames.length; i++) {
      if (patternLower.includes(this.dayNames[i].toLowerCase())) {
        targetDay = i;
        break;
      }
    }
    
    if (targetDay === -1) return []; // No valid day found
    
    // Check for ordinal patterns (1st, 2nd, 3rd, 4th, 5th)
    const ordinals = {
      '1st': 1, 'first': 1,
      '2nd': 2, 'second': 2,
      '3rd': 3, 'third': 3,
      '4th': 4, 'fourth': 4,
      '5th': 5, 'fifth': 5
    };
    
    let targetOccurrence = null;
    for (const [key, value] of Object.entries(ordinals)) {
      if (patternLower.includes(key)) {
        targetOccurrence = value;
        break;
      }
    }
    
    // Find all occurrences of the target day in the month
    let occurrence = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === targetDay) {
        occurrence++;
        
        if (targetOccurrence === null) {
          // "Every [Day]" - add all occurrences
          dates.push(this.formatDateISO(year, month, day));
        } else if (occurrence === targetOccurrence) {
          // "[Ordinal] [Day]" - add specific occurrence
          dates.push(this.formatDateISO(year, month, day));
          break;
        }
      }
    }
    
    return dates;
  }
  
  /**
   * Get all event dates for a given month (both specific dates and recurring)
   */
  getEventDatesForMonth(year, month) {
    const eventDates = new Set();
    const targetMonthStart = new Date(year, month, 1);
    const targetMonthEnd = new Date(year, month + 1, 0);
    
    this.allEvents.forEach(event => {
      if (!event.active) return;
      
      // Check for specific dated events
      if (event.date && event.date.trim()) {
        const eventDate = new Date(event.date + 'T00:00:00');
        if (eventDate >= targetMonthStart && eventDate <= targetMonthEnd) {
          // Only include if it's today or future
          if (this.isFutureDate(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())) {
            eventDates.add(event.date);
          }
        }
      }
      
      // Check for recurring events
      if (event.recurring_pattern && event.recurring_pattern.trim()) {
        if (!event.date || !event.date.trim()) {
          const recurringDates = this.getRecurringDates(event.recurring_pattern, year, month);
          recurringDates.forEach(date => {
            // Only include future dates
            const [y, m, d] = date.split('-').map(Number);
            if (this.isFutureDate(y, m - 1, d)) {
              eventDates.add(date);
            }
          });
        }
      }
    });
    
    return Array.from(eventDates);
  }
  
  /**
   * Get all events for a specific date
   */
  getEventsForDate(dateISO) {
    const events = [];
    const [year, month, day] = dateISO.split('-').map(Number);
    
    this.allEvents.forEach(event => {
      if (!event.active) return;
      
      // Check specific dated events
      if (event.date && event.date === dateISO) {
        events.push(event);
      }
      
      // Check recurring events
      if (event.recurring_pattern && event.recurring_pattern.trim()) {
        if (!event.date || !event.date.trim()) {
          const recurringDates = this.getRecurringDates(event.recurring_pattern, year, month - 1);
          if (recurringDates.includes(dateISO)) {
            events.push(event);
          }
        }
      }
    });
    
    return events;
  }
  
  /**
   * Generate HTML for calendar grid
   */
  generateCalendarGrid(year, month) {
    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDay = this.getFirstDayOfMonth(year, month);
    const eventDates = this.getEventDatesForMonth(year, month);
    
    let html = '<table class="calendar-table" role="grid" aria-label="Events calendar">';
    
    // Table header
    html += '<thead><tr>';
    for (let i = 0; i < 7; i++) {
      html += `<th scope="col"><span aria-hidden="true">${this.dayNamesShort[i]}</span><span class="visually-hidden">${this.dayNames[i]}</span></th>`;
    }
    html += '</tr></thead>';
    
    // Table body
    html += '<tbody>';
    
    let dayCounter = 1;
    let rowCount = Math.ceil((firstDay + daysInMonth) / 7);
    
    for (let row = 0; row < rowCount; row++) {
      html += '<tr>';
      
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDay) {
          // Empty cell before month starts
          html += '<td class="empty"></td>';
        } else if (dayCounter > daysInMonth) {
          // Empty cell after month ends
          html += '<td class="empty"></td>';
        } else {
          // Day cell
          const dateISO = this.formatDateISO(year, month, dayCounter);
          const hasEvents = eventDates.includes(dateISO);
          const todayClass = this.isToday(year, month, dayCounter) ? 'today' : '';
          const eventsClass = hasEvents ? 'has-events' : '';
          const classes = ['calendar-day', todayClass, eventsClass].filter(Boolean).join(' ');
          
          html += `<td class="${classes}">`;
          
          if (hasEvents) {
            html += `<a href="#date-${dateISO}" class="day-link">`;
            html += `<span class="day-number">${dayCounter}</span>`;
            
            if (this.isToday(year, month, dayCounter)) {
              html += '<span class="today-label">Today</span>';
            } else {
              html += '<span class="event-label">Event</span>';
            }
            
            html += '</a>';
          } else {
            html += '<span class="day-no-link">';
            html += `<span class="day-number">${dayCounter}</span>`;
            
            if (this.isToday(year, month, dayCounter)) {
              html += '<span class="today-label">Today</span>';
            }
            
            html += '</span>';
          }
          
          html += '</td>';
          dayCounter++;
        }
      }
      
      html += '</tr>';
    }
    
    html += '</tbody></table>';
    
    return html;
  }
  
  /**
   * Convert image filename to full path (matches eventImage filter in .eleventy.js)
   */
  eventImagePath(filename) {
    if (!filename) return '';
    // If it's already a full URL (http:// or https://), return as-is
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    // Otherwise, prepend the local events images path
    return `/assets/images/events/${filename}`;
  }
  
  /**
   * Generate HTML for events list grouped by date
   */
  generateEventsList(year, month) {
    const eventDates = this.getEventDatesForMonth(year, month);
    
    if (eventDates.length === 0) {
      return '<div class="alert alert-info"><p class="mb-0">No upcoming events for this month. Check back soon!</p></div>';
    }
    
    // Sort dates
    eventDates.sort();
    
    let html = '';
    
    eventDates.forEach(dateISO => {
      const events = this.getEventsForDate(dateISO);
      const [year, month, day] = dateISO.split('-').map(Number);
      const dateDisplay = this.formatDateDisplay(year, month - 1, day);
      
      html += `<div class="date-group" id="date-${dateISO}">`;
      html += `<h3 class="date-header">${dateDisplay}</h3>`;
      
      events.forEach(event => {
        html += '<div class="event-card-compact">';
        
        if (event.image_url) {
          html += '<div class="event-image">';
          html += `<img src="${this.eventImagePath(event.image_url)}" alt="${event.image_alt || ''}">`;
          html += '</div>';
        }
        
        html += '<div class="event-content">';
        html += `<h4 class="event-title">${event.title}</h4>`;
        
        if (event.recurring_pattern) {
          html += `<p class="recurring-pattern"><i class="fas fa-calendar-week" aria-hidden="true"></i> ${event.recurring_pattern}</p>`;
        }
        
        html += '<div class="event-meta">';
        
        if (event.time_start) {
          html += '<span class="event-time">';
          html += '<i class="far fa-clock" aria-hidden="true"></i> ';
          html += event.time_start;
          if (event.time_end && event.time_end.trim()) {
            html += ` - ${event.time_end}`;
          }
          html += '</span>';
        }
        
        if (event.price) {
          html += '<span class="event-price">';
          html += '<i class="fas fa-ticket-alt" aria-hidden="true"></i> ';
          html += event.price;
          html += '</span>';
        }
        
        html += '</div>'; // event-meta
        
        if (event.description) {
          html += `<p class="event-description">${event.description}</p>`;
        }
        
        if (event.ticket_link || event.instagram_link) {
          html += '<div class="event-actions">';
          
          if (event.ticket_link) {
            html += `<a href="${event.ticket_link}" class="hero-btn hero-btn-sm">`;
            html += '<i class="fas fa-ticket-alt" aria-hidden="true"></i> Tickets';
            html += `<span class="visually-hidden"> - ${event.title}</span>`;
            html += '</a>';
          }
          
          if (event.instagram_link) {
            html += `<a href="${event.instagram_link}" class="hero-btn hero-btn-sm">`;
            html += '<i class="fab fa-instagram" aria-hidden="true"></i> Instagram';
            html += `<span class="visually-hidden"> - ${event.title}</span>`;
            html += '</a>';
          }
          
          html += '</div>'; // event-actions
        }
        
        html += '</div>'; // event-content
        html += '</div>'; // event-card-compact
      });
      
      html += '</div>'; // date-group
    });
    
    return html;
  }
  
  /**
   * Render the calendar for the current month
   */
  render() {
    // Update header
    const headerEl = document.querySelector('.calendar-header h2');
    if (headerEl) {
      headerEl.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }
    
    // Update calendar grid
    const gridEl = document.querySelector('.calendar-grid');
    if (gridEl) {
      gridEl.innerHTML = this.generateCalendarGrid(this.currentYear, this.currentMonth);
    }
    
    // Update events list
    const listEl = document.querySelector('.events-by-date');
    if (listEl) {
      const title = listEl.querySelector('h2');
      listEl.innerHTML = '<h2 class="h4 mb-4">Upcoming Events by Date</h2>';
      listEl.innerHTML += this.generateEventsList(this.currentYear, this.currentMonth);
    }
    
    // Update navigation button states
    this.updateNavigationState();
  }
  
  /**
   * Update navigation button states (disable if no events in that direction)
   */
  updateNavigationState() {
    const prevBtn = document.getElementById('calendar-prev');
    
    // Disable previous button if we're on the current month
    if (prevBtn) {
      const isCurrentMonth = this.currentYear === this.today.getFullYear() && 
                             this.currentMonth === this.today.getMonth();
      
      if (isCurrentMonth) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
      } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '';
        prevBtn.style.cursor = '';
      }
    }
  }
  
  /**
   * Navigate to previous month
   */
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.render();
  }
  
  /**
   * Navigate to next month
   */
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.render();
  }
  
  /**
   * Go to current month
   */
  goToToday() {
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    this.render();
  }
}

// Initialize calendar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendar);
} else {
  initCalendar();
}

function initCalendar() {
  // Get events data from the page
  const eventsDataEl = document.getElementById('events-data');
  if (!eventsDataEl) {
    console.error('Events data not found');
    return;
  }
  
  let eventsData;
  try {
    eventsData = JSON.parse(eventsDataEl.textContent);
  } catch (e) {
    console.error('Failed to parse events data:', e);
    return;
  }
  
  // Create calendar instance
  const calendar = new EventCalendar(eventsData);
  
  // Render initial view
  calendar.render();
  
  // Set up navigation
  const prevBtn = document.getElementById('calendar-prev');
  const nextBtn = document.getElementById('calendar-next');
  const todayBtn = document.getElementById('calendar-today');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => calendar.previousMonth());
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => calendar.nextMonth());
  }
  
  if (todayBtn) {
    todayBtn.addEventListener('click', () => calendar.goToToday());
  }
}
