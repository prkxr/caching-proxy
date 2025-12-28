const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../cache.json');

function loadCache() {
    if (!fs.existsSync(CACHE_FILE)) {
        return {};
    }
    try {
        const data = fs.readFileSync(CACHE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

function saveCache(cache) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

module.exports = {
    get: (key) => {
        const cache = loadCache();
        return cache[key];
    },

    set: (key, value) => {
        const cache = loadCache();
        cache[key] = value;
        saveCache(cache);
    },

    clear: () => {
        saveCache({});
        console.log("Cache cleared successfully.");
    }
};