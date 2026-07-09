const Store = {
    // Current User Management
    getCurrentUser() {
        return localStorage.getItem('safari_current_user') || null;
    },
    setCurrentUser(name) {
        localStorage.setItem('safari_current_user', name);
    },

    // Checklists (per user)
    // Key format: safari_checklist_{listId}_{userName} -> array of checked item IDs
    getChecklist(listId, userName) {
        if (!userName) return [];
        const data = localStorage.getItem(`safari_checklist_${listId}_${userName}`);
        return data ? JSON.parse(data) : [];
    },
    toggleChecklistItem(listId, userName, itemId, isChecked) {
        if (!userName) return;
        const list = this.getChecklist(listId, userName);
        if (isChecked && !list.includes(itemId)) {
            list.push(itemId);
        } else if (!isChecked && list.includes(itemId)) {
            const index = list.indexOf(itemId);
            list.splice(index, 1);
        }
        localStorage.setItem(`safari_checklist_${listId}_${userName}`, JSON.stringify(list));
    },

    // Generic form data per user (e.g., game drive log, journal)
    getEntries(storeId) {
        const data = localStorage.getItem(`safari_entries_${storeId}`);
        return data ? JSON.parse(data) : [];
    },
    addEntry(storeId, entry) {
        const entries = this.getEntries(storeId);
        entries.push({ id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry });
        localStorage.setItem(`safari_entries_${storeId}`, JSON.stringify(entries));
    },
    deleteEntry(storeId, entryId) {
        let entries = this.getEntries(storeId);
        entries = entries.filter(e => e.id !== entryId);
        localStorage.setItem(`safari_entries_${storeId}`, JSON.stringify(entries));
    },

    // Wishlist Voting
    // Item format: { id, title, addedBy, votes: [userNames...] }
    getWishlist() {
        const data = localStorage.getItem('safari_wishlist');
        return data ? JSON.parse(data) : [];
    },
    addWishlistItem(title, userName) {
        if (!userName) return;
        const list = this.getWishlist();
        list.push({ id: Date.now().toString(), title, addedBy: userName, votes: [userName] });
        localStorage.setItem('safari_wishlist', JSON.stringify(list));
    },
    toggleWishlistVote(itemId, userName) {
        if (!userName) return;
        const list = this.getWishlist();
        const item = list.find(i => i.id === itemId);
        if (item) {
            const voteIndex = item.votes.indexOf(userName);
            if (voteIndex > -1) {
                item.votes.splice(voteIndex, 1);
            } else {
                item.votes.push(userName);
            }
            localStorage.setItem('safari_wishlist', JSON.stringify(list));
        }
    }
};
