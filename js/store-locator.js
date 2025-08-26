(function() {
    'use strict';
    const CONFIG = {
        ZIP_API_URL: 'https://api.zippopotam.us/us/',
        ZIP_API_TIMEOUT: 10000,
        EARTH_RADIUS_MILES: 3958.7613,
        MAX_RESULTS: 8, // Show all stores
        ANIMATION_DURATION: 300,
        ERRORS: {
            ZIP_INVALID: 'Enter a valid 5-digit ZIP code.',
            ZIP_NOT_FOUND: 'Sorry, we couldn\'t find that ZIP code.',
            API_ERROR: 'Unable to find coordinates for this ZIP code.',
            NO_STORES: 'No stores found.',
            SEARCHING: 'Finding nearest stores…',
            GEOLOCATION_ERROR: 'Unable to access your location. Please try ZIP code search.',
            GEOLOCATION_SEARCHING: 'Detecting your location…'
        }
    };

    const STORES = [
        { 
            name: "Fishtown", 
            slug: "fishtown", 
            address: "1428 Frankford Ave", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19125", 
            lat: 39.9737, 
            lng: -75.1287
        },
        { 
            name: "Northern Liberties", 
            slug: "northern-liberties", 
            address: "200 Spring Garden St", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19123", 
            lat: 39.9637, 
            lng: -75.1417
        },
        { 
            name: "Fairmount", 
            slug: "fairmount", 
            address: "2112 Fairmount Ave", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19130", 
            lat: 39.9687, 
            lng: -75.1727
        },
        { 
            name: "Old City", 
            slug: "old-city", 
            address: "45 N 3rd St", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19106", 
            lat: 39.9517, 
            lng: -75.1437
        },
        { 
            name: "East Market", 
            slug: "east-market", 
            address: "11 S 12th St", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19107", 
            lat: 39.9517, 
            lng: -75.1577
        },
        { 
            name: "Art Museum", 
            slug: "art-museum", 
            address: "1819 John F Kennedy Blvd", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19103", 
            lat: 39.9657, 
            lng: -75.1807
        },
        { 
            name: "Rittenhouse", 
            slug: "rittenhouse", 
            address: "2101 South St", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19146", 
            lat: 39.9417, 
            lng: -75.1757
        },
        { 
            name: "Passyunk", 
            slug: "passyunk", 
            address: "1701 E Passyunk Ave", 
            city: "Philadelphia", 
            state: "PA", 
            zip: "19148", 
            lat: 39.9257, 
            lng: -75.1577
        }
    ];

    const LOCAL_ZIP_CACHE = {
        "19125": { lat: 39.9737, lng: -75.1287 },
        "19123": { lat: 39.9637, lng: -75.1417 },
        "19130": { lat: 39.9687, lng: -75.1727 },
        "19106": { lat: 39.9517, lng: -75.1437 },
        "19107": { lat: 39.9517, lng: -75.1577 },
        "19103": { lat: 39.9657, lng: -75.1807 },
        "19146": { lat: 39.9417, lng: -75.1757 },
        "19148": { lat: 39.9257, lng: -75.1577 }
    };

    function toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) ** 2 + 
                  Math.cos(toRadians(lat1)) * 
                  Math.cos(toRadians(lat2)) * 
                  Math.sin(dLon / 2) ** 2;
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return CONFIG.EARTH_RADIUS_MILES * c;
    }

    function isValidZipCode(zip) {
        return /^\d{5}$/.test(zip);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async function zipToCoordinates(zip) {
        if (LOCAL_ZIP_CACHE[zip]) {
            return LOCAL_ZIP_CACHE[zip];
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.ZIP_API_TIMEOUT);

            const response = await fetch(`${CONFIG.ZIP_API_URL}${zip}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('ZIP not found');
            }

            const data = await response.json();
            const place = data.places?.[0];

            if (!place) {
                throw new Error('No location data found');
            }

            return {
                lat: parseFloat(place.latitude),
                lng: parseFloat(place.longitude)
            };

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw new Error(CONFIG.ERRORS.API_ERROR);
        }
    }

    function sortStoresByDistance(lat, lng, stores) {
        return [...stores]
            .map(store => ({
                ...store,
                distance: calculateDistance(lat, lng, store.lat, store.lng)
            }))
            .sort((a, b) => a.distance - b.distance);
    }

    function getNearestStores(lat, lng, limit = CONFIG.MAX_RESULTS) {
        const sortedStores = sortStoresByDistance(lat, lng, STORES);
        return sortedStores.slice(0, limit);
    }

    /**
     * Get user's current location
     * @returns {Promise<Object>} Coordinates object
     */
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error(CONFIG.ERRORS.GEOLOCATION_ERROR));
                },
                options
            );
        });
    }

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    function setStatus(message, isError = false) {
        const statusEl = $('#status');
        if (!statusEl) return;

        statusEl.className = isError ? 'store-locator-status error' : 'store-locator-status';
        statusEl.textContent = message || '';
    }

    function clearStatus() {
        setStatus('');
    }

    function showModal() {
        const modal = $('#locator-modal');
        if (!modal) return;

        modal.style.display = 'block';
        
        const input = $('#zip');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }

        // Show all stores at startup (sorted by distance from Philadelphia center)
        const phillyCenter = { lat: 39.9526, lng: -75.1652 };
        const allStores = sortStoresByDistance(phillyCenter.lat, phillyCenter.lng, STORES);
        renderStores(allStores, 'in Philadelphia area');
        clearStatus();
    }

    function hideModal() {
        const modal = $('#locator-modal');
        if (!modal) return;

        modal.style.display = 'none';
        clearResults();
        clearStatus();
    }

    function clearResults() {
        const resultsEl = $('#results');
        if (resultsEl) {
            resultsEl.innerHTML = '';
        }
    }

    function renderStores(stores, originLabel = '') {
        const resultsEl = $('#results');
        if (!resultsEl) return;

        if (!stores || stores.length === 0) {
            resultsEl.innerHTML = `<div class="store-locator-status">${CONFIG.ERRORS.NO_STORES}</div>`;
            return;
        }

        const header = originLabel ? 
            `<div style="margin-bottom: 12px; color: #374151; font-size: 14px; font-weight: 600;">Nearest results (${originLabel})</div>` : '';

        const storesHTML = stores.map((store, index) => {
            const isSelected = index === 0;
            const actionHTML = isSelected ? 
                '<div class="store-locator-indicator"><span class="store-locator-checkmark">✓</span> My Store</div>' : 
                `<a href="/pages/${store.slug}" class="store-locator-link">View Store</a>`;

            return `
                <div class="store-locator-item ${isSelected ? 'store-locator-selected' : ''}">
                    <div class="store-locator-info">
                        <div class="store-locator-name">${store.name} | ${store.address} ${store.city} ${store.state}</div>
                        <div class="store-locator-address">${store.address}</div>
                        <div class="store-locator-address">${store.city}, ${store.state} ${store.zip}</div>
                        <div class="store-locator-distance">Distance: <strong>${store.distance.toFixed(2)} mi</strong></div>
                    </div>
                    <div class="store-locator-actions">
                        ${actionHTML}
                    </div>
                </div>
            `;
        }).join('');

        resultsEl.innerHTML = header + storesHTML;
    }

    async function handleZipSearch() {
        const zipInput = $('#zip');
        if (!zipInput) return;

        const zip = zipInput.value.trim();

        if (!isValidZipCode(zip)) {
            setStatus(CONFIG.ERRORS.ZIP_INVALID, true);
            return;
        }

        setStatus(CONFIG.ERRORS.SEARCHING);

        try {
            // Get coordinates for ZIP code
            const coords = await zipToCoordinates(zip);
            
            // Get all stores sorted by distance (no limit)
            const allStores = sortStoresByDistance(coords.lat, coords.lng, STORES);
            
            // Render results
            renderStores(allStores, `from ${zip}`);
            clearStatus();

        } catch (error) {
            console.error('Store locator error:', error);
            setStatus(CONFIG.ERRORS.ZIP_NOT_FOUND, true);
        }
    }

    function handleModalClose() {
        hideModal();
    }

    function handleModalOverlayClick(event) {
        const modal = $('#locator-modal');
        if (event.target === modal) {
            hideModal();
        }
    }

    function handleZipKeydown(event) {
        if (event.key === 'Enter') {
            handleZipSearch();
        }
    }

    /**
     * Handle geolocation search
     */
    async function handleGeolocationSearch() {
        const geoButton = $('#use-geolocation');
        if (!geoButton) return;

        // Disable button and show loading state
        geoButton.disabled = true;
        geoButton.textContent = 'Detecting location...';
        setStatus(CONFIG.ERRORS.GEOLOCATION_SEARCHING);

        try {
            // Get user's current location
            const coords = await getCurrentLocation();
            
            // Get all stores sorted by distance (no limit)
            const allStores = sortStoresByDistance(coords.lat, coords.lng, STORES);
            
            // Render results
            renderStores(allStores, 'using your location');
            clearStatus();

        } catch (error) {
            console.error('Geolocation error:', error);
            setStatus(CONFIG.ERRORS.GEOLOCATION_ERROR, true);
        } finally {
            // Re-enable button
            geoButton.disabled = false;
            geoButton.textContent = 'Use Current Location';
        }
    }


    function initializeEventListeners() {
        // Modal trigger
        const openButton = $('#open-locator');
        if (openButton) {
            openButton.addEventListener('click', showModal);
        }

        // Modal close
        const closeButton = $('#close-locator');
        if (closeButton) {
            closeButton.addEventListener('click', handleModalClose);
        }

        // Modal overlay
        const modal = $('#locator-modal');
        if (modal) {
            modal.addEventListener('click', handleModalOverlayClick);
        }

        // Search button
        const searchButton = $('#search-zip');
        if (searchButton) {
            searchButton.addEventListener('click', handleZipSearch);
        }

        // ZIP input
        const zipInput = $('#zip');
        if (zipInput) {
            zipInput.addEventListener('keydown', handleZipKeydown);
        }

        // Geolocation button
        const geoButton = $('#use-geolocation');
        if (geoButton) {
            geoButton.addEventListener('click', handleGeolocationSearch);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = $('#locator-modal');
                if (modal && modal.style.display === 'block') {
                    hideModal();
                }
            }
        });
    }

    function init() {
        try {
            initializeEventListeners();
            console.log('Store locator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize store locator:', error);
        }
    }

    window.StoreLocator = {
        init,
        showModal,
        hideModal,
        searchByZip: handleZipSearch,
        getNearestStores,
        STORES
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
