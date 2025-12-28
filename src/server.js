const express = require('express');
const axios = require('axios');
const path = require('path');

let cacheService;
try {
    cacheService = require('./cache');
} catch (e) {
    cacheService = null;
}

const startServer = (port, origin) => {
    const app = express();

    app.use(express.json());

    app.use(async (req, res) => {
        const route = req.originalUrl; 
        const cacheKey = `${req.method}:${route}`; 

        console.log(`[REQUEST] ${req.method} ${route}`);

        if (cacheService) {
            const cachedResponse = cacheService.get(cacheKey);
            if (cachedResponse) {
                console.log(`[CACHE HIT] Serving from cache`);
                res.set('X-Cache', 'HIT');
                return res.send(cachedResponse);
            }
        }

        try {
            const targetUrl = `${origin}${route}`;
            console.log(`[FORWARDING] -> ${targetUrl}`);

            const response = await axios({
                method: req.method,
                url: targetUrl,
                data: req.body,
                params: req.query
            });

            if (cacheService) {
                cacheService.set(cacheKey, response.data);
            }

            res.set('X-Cache', 'MISS');
            return res.send(response.data);

        } catch (error) {
            console.error(`[ERROR] Forwarding failed: ${error.message}`);
            
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            } else {
                res.status(500).send({ error: "Error forwarding request to origin" });
            }
        }
    });

    app.listen(port, () => {
        console.log(`\n Caching Proxy running on port ${port}`);
        console.log(` Forwarding requests to: ${origin}`);
        console.log(`----------------------------------------`);
    });
};

module.exports = { startServer };