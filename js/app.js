const app = {
    currentUser: null,

    init() {
        this.populateNameSelector();
        this.bindEvents();
        
        const savedUser = Store.getCurrentUser();
        if (savedUser) {
            document.getElementById('name-select').value = savedUser;
            this.handleUserChange(savedUser);
        } else {
            this.updateUserWarnings();
        }

        this.renderAllStatic();
        
        // Handle hash routing on load
        const hash = window.location.hash.replace('#', '') || 'home';
        this.navTo(hash);
        
        this.startCountdown();
    },

    bindEvents() {
        document.getElementById('name-select').addEventListener('change', (e) => {
            this.handleUserChange(e.target.value);
        });
    },

    handleUserChange(name) {
        this.currentUser = name;
        Store.setCurrentUser(name);
        this.updateUserWarnings();
        this.renderUserSpecific();
    },

    updateUserWarnings() {
        const warnings = document.querySelectorAll('.needs-user');
        warnings.forEach(w => {
            w.style.display = this.currentUser ? 'none' : 'block';
        });
    },

    navTo(sectionId) {
        // Update URL hash without jumping
        history.replaceState(null, null, `#${sectionId}`);
        
        // Hide all sections
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show target section
        const target = document.getElementById(`sec-${sectionId}`);
        if (target) target.classList.add('active');

        // Update nav buttons
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('href') === `#${sectionId}`) {
                nav.classList.add('active');
            }
        });

        // Theme switching based on section
        const zanzibarSections = ['extras']; // Or any section you want completely Zanzibar themed
        // Wait, requirements: "Visual style should shift by section... Safari vs Zanzibar".
        // Let's make "planning" partly zanzibar or just handle theme classes.
        // Actually, we can use body class.
        // Let's say Home, Logistics, Trip are Safari themed. Extras is Zanzibar themed.
        // For planning, we have mixed. Let's just use CSS cascading for the specific cards inside Planning.
        if (sectionId === 'extras') {
            document.body.className = 'theme-zanzibar';
        } else {
            document.body.className = 'theme-safari';
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    },

    goToItineraryDay(dayId) {
        this.navTo('logistics');
        requestAnimationFrame(() => {
            const el = document.getElementById(dayId);
            if (!el) return;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlight-flash');
            setTimeout(() => el.classList.remove('highlight-flash'), 1500);
        });
    },

    // Map pin tap: show the stop's name in the readout bar instead of
    // jumping away immediately, so tapping a pin just tells you what it is.
    showMapPin(event, name, dayText, dayId) {
        event.stopPropagation();
        const readout = document.getElementById('map-readout');
        if (!readout) return;
        readout.innerHTML = `📍 <strong>${name}</strong> <span class="map-readout-day">${dayText}</span> <span class="map-readout-arrow">View day ›</span>`;
        readout.classList.add('active');
        readout.dataset.dayId = dayId;
    },

    closeMapReadout() {
        const readout = document.getElementById('map-readout');
        if (!readout || !readout.classList.contains('active')) return;
        readout.classList.remove('active');
        delete readout.dataset.dayId;
        readout.textContent = 'Tap a pin above to see the stop name';
    },

    goToPinDay() {
        const readout = document.getElementById('map-readout');
        if (!readout || !readout.dataset.dayId) return;
        this.goToItineraryDay(readout.dataset.dayId);
    },

    populateNameSelector() {
        const select = document.getElementById('name-select');
        AppData.users.forEach(user => {
            const opt = document.createElement('option');
            opt.value = user;
            opt.textContent = user;
            select.appendChild(opt);
        });
    },

    renderAllStatic() {
        // Zanzibar shortlist
        const znzAct = document.getElementById('znz-activities');
        AppData.zanzibarActivities.forEach(act => {
            znzAct.innerHTML += `<div class="shortlist-item"><strong>${act.title}</strong><br>${act.desc}</div>`;
        });

        // Swahili
        const swaList = document.getElementById('swahili-list');
        AppData.swahili.forEach(word => {
            swaList.innerHTML += `<li><span class="eng">${word.eng}</span> <span class="swa">${word.swa}</span></li>`;
        });
    },

    renderUserSpecific() {
        if (!this.currentUser) return;
        this.renderChecklist('vax-list', AppData.vaccines, 'vaccines');
        
        const packingData = [
            { category: 'Safari', items: AppData.packing.safari },
            { category: 'Zanzibar', items: AppData.packing.zanzibar },
            { category: 'General', items: AppData.packing.general }
        ];
        this.renderGroupedChecklist('packing-list', packingData, 'packing');
        
        this.renderChecklist('big-five-list', AppData.wildlife.bigFive, 'bigfive');
        this.renderChecklist('bonus-wildlife-list', AppData.wildlife.bonus, 'bonus');
        
        this.renderWishlist();
        this.renderEntries('game-drive-list', 'gamedrive');
        this.renderEntries('journal-list', 'journal');
        this.renderZanzibarHotels();
        this.renderEntries('znz-shortlist-suggestions', 'znz_shortlist');
    },

    addShortlistSuggestion() {
        if (!this.currentUser) return alert('Select your name first!');
        const input = document.getElementById('znz-shortlist-new');
        if (!input.value) return;

        Store.addEntry('znz_shortlist', { userName: this.currentUser, text: input.value });
        input.value = '';
        this.renderEntries('znz-shortlist-suggestions', 'znz_shortlist');
    },

    // Zanzibar Hotel Decision
    renderZanzibarHotels() {
        const container = document.getElementById('znz-hotels');
        if (!container) return;
        container.innerHTML = '';

        AppData.zanzibarHotels.forEach(hotel => {
            const votes = Store.getHotelVotes(hotel.id);
            const hasVoted = this.currentUser && votes.includes(this.currentUser);
            const comments = Store.getEntries(`hotel_comments_${hotel.id}`);

            const wrap = document.createElement('div');
            wrap.className = 'hotel-option';
            wrap.innerHTML = `
                <div class="hotel-option-header">
                    <h4><a href="${hotel.link}" target="_blank" rel="noopener">${hotel.name}</a><br><small>${hotel.note}</small></h4>
                    <button class="vote-btn ${hasVoted ? 'voted' : ''}" onclick="app.voteHotel('${hotel.id}')">▲ ${votes.length}</button>
                </div>
                <ul class="log-list hotel-comments" id="hotel-comments-${hotel.id}"></ul>
                <div class="form-group">
                    <input type="text" id="hotel-comment-${hotel.id}" placeholder="Add a comment...">
                    <button onclick="app.addHotelComment('${hotel.id}')">Add</button>
                </div>
            `;
            container.appendChild(wrap);

            const list = wrap.querySelector(`#hotel-comments-${hotel.id}`);
            comments.forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="entry-meta">${entry.userName} • ${new Date(entry.timestamp).toLocaleDateString()}</div>
                    <div class="entry-content">${entry.text}</div>
                    <button class="delete-btn" onclick="app.deleteHotelComment('${hotel.id}', '${entry.id}')">×</button>
                `;
                list.appendChild(li);
            });
        });
    },

    voteHotel(hotelId) {
        if (!this.currentUser) return alert('Select your name first!');
        Store.toggleHotelVote(hotelId, this.currentUser);
        this.renderZanzibarHotels();
    },

    addHotelComment(hotelId) {
        if (!this.currentUser) return alert('Select your name first!');
        const input = document.getElementById(`hotel-comment-${hotelId}`);
        if (!input.value) return;

        Store.addEntry(`hotel_comments_${hotelId}`, { userName: this.currentUser, text: input.value });
        input.value = '';
        this.renderZanzibarHotels();
    },

    deleteHotelComment(hotelId, commentId) {
        Store.deleteEntry(`hotel_comments_${hotelId}`, commentId);
        this.renderZanzibarHotels();
    },

    renderChecklist(containerId, items, storeId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const saved = Store.getChecklist(storeId, this.currentUser);
        
        items.forEach(item => {
            const isChecked = saved.includes(item.id);
            const div = document.createElement('div');
            div.className = 'check-item';
            div.innerHTML = `
                <label>
                    <input type="checkbox" onchange="app.toggleCheck('${storeId}', '${item.id}', this.checked)" ${isChecked ? 'checked' : ''}>
                    ${item.label}
                </label>
            `;
            container.appendChild(div);
        });
    },

    renderGroupedChecklist(containerId, groups, storeId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const saved = Store.getChecklist(storeId, this.currentUser);
        
        groups.forEach(group => {
            const section = document.createElement('div');
            section.className = 'packing-group';
            section.innerHTML = `<h4>${group.category}</h4>`;
            group.items.forEach(item => {
                const isChecked = saved.includes(item.id);
                const div = document.createElement('div');
                div.className = 'check-item';
                div.innerHTML = `
                    <label>
                        <input type="checkbox" onchange="app.toggleCheck('${storeId}', '${item.id}', this.checked)" ${isChecked ? 'checked' : ''}>
                        ${item.label}
                    </label>
                `;
                section.appendChild(div);
            });
            container.appendChild(section);
        });
    },

    toggleCheck(storeId, itemId, isChecked) {
        if (!this.currentUser) return;
        Store.toggleChecklistItem(storeId, this.currentUser, itemId, isChecked);
    },

    // Entries
    renderEntries(containerId, storeId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const entries = Store.getEntries(storeId);
        entries.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="entry-meta">${entry.userName} • ${new Date(entry.timestamp).toLocaleDateString()}</div>
                <div class="entry-content">${entry.text}</div>
                <button class="delete-btn" onclick="app.deleteEntry('${storeId}', '${entry.id}')">×</button>
            `;
            container.appendChild(li);
        });
    },

    addGameDriveLog() {
        if (!this.currentUser) return alert('Select your name first!');
        const animal = document.getElementById('gd-animal').value;
        const loc = document.getElementById('gd-location').value;
        if (!animal) return;
        
        Store.addEntry('gamedrive', { userName: this.currentUser, text: `<strong>${animal}</strong> (${loc})` });
        document.getElementById('gd-animal').value = '';
        document.getElementById('gd-location').value = '';
        this.renderEntries('game-drive-list', 'gamedrive');
    },

    addJournalEntry() {
        if (!this.currentUser) return alert('Select your name first!');
        const text = document.getElementById('journal-text').value;
        if (!text) return;
        
        Store.addEntry('journal', { userName: this.currentUser, text });
        document.getElementById('journal-text').value = '';
        this.renderEntries('journal-list', 'journal');
    },

    deleteEntry(storeId, entryId) {
        Store.deleteEntry(storeId, entryId);
        const containerIds = {
            gamedrive: 'game-drive-list',
            journal: 'journal-list',
            znz_shortlist: 'znz-shortlist-suggestions'
        };
        this.renderEntries(containerIds[storeId] || storeId, storeId);
    },

    // Wishlist
    renderWishlist() {
        const container = document.getElementById('wishlist-items');
        container.innerHTML = '';
        const list = Store.getWishlist();
        
        list.sort((a, b) => b.votes.length - a.votes.length).forEach(item => {
            const hasVoted = this.currentUser && item.votes.includes(this.currentUser);
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="wishlist-info">
                    <strong>${item.title}</strong>
                    <div class="meta">Added by ${item.addedBy} • ${item.votes.length} votes</div>
                </div>
                <button class="vote-btn ${hasVoted ? 'voted' : ''}" onclick="app.voteWishlist('${item.id}')">
                    ▲ ${item.votes.length}
                </button>
            `;
            container.appendChild(li);
        });
    },

    addWishlist() {
        if (!this.currentUser) return alert('Select your name first!');
        const input = document.getElementById('wishlist-new');
        if (!input.value) return;
        
        Store.addWishlistItem(input.value, this.currentUser);
        input.value = '';
        this.renderWishlist();
    },

    voteWishlist(itemId) {
        if (!this.currentUser) return alert('Select your name first!');
        Store.toggleWishlistVote(itemId, this.currentUser);
        this.renderWishlist();
    },

    // Photo Tabs
    switchPhotoTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        // Simple static placeholder change
        document.getElementById('photo-grid').innerHTML = `<p class="placeholder-text">${tab === 'safari' ? 'Safari' : 'Zanzibar'} photos will appear here after the trip. Add to <code>/assets/photos/${tab}/</code></p>`;
    },

    // Countdown
    startCountdown() {
        // Set trip date to some future date (e.g., Dec 1, 2026)
        const tripDate = new Date('2026-12-01T00:00:00').getTime();
        const el = document.querySelector('#countdown-timer .days');
        
        const update = () => {
            const now = new Date().getTime();
            const diff = tripDate - now;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (el) el.textContent = days > 0 ? days : 0;
        };
        update();
        setInterval(update, 86400000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
