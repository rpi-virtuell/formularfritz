/**
 * API Client Modul
 * Sendet JSON-Daten an n8n-Webhooks
 * 
 * @module APIClient
 */

const APIClient = (function() {
    'use strict';

    // Default-Konfiguration
    let config = {
        url: '',
        method: 'POST',
        contentType: 'application/json',
        timeout: 30000
    };

    /**
     * Konfiguriert den API-Client
     * @param {Object} options - Konfigurationsoptionen
     */
    function configure(options) {
        config = { ...config, ...options };
    }

    /**
     * Sendet JSON-Daten an den konfigurierten Endpoint
     * @param {Object} data - Die zu sendenden Daten
     * @param {Object} options - Optionale Override-Optionen
     * @returns {Promise<Object>} Response-Objekt
     */
    async function send(data, options = {}) {
        const mergedConfig = { ...config, ...options };

        if (!mergedConfig.url) {
            throw new Error('Kein Endpoint konfiguriert');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);

        try {
            const response = await fetch(mergedConfig.url, {
                method: mergedConfig.method,
                headers: {
                    'Content-Type': mergedConfig.contentType,
                    ...mergedConfig.headers
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            };

            // Versuche Response-Body zu parsen
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result.data = await response.json();
            } else {
                result.data = await response.text();
            }

            if (!response.ok) {
                throw new APIError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    result.data
                );
            }

            return result;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408, null);
            }

            if (error instanceof APIError) {
                throw error;
            }

            throw new APIError(error.message, 0, null);
        }
    }

    /**
     * Testet die Verbindung zum Endpoint
     * @param {string} url - Optional: URL zum Testen
     * @returns {Promise<boolean>}
     */
    async function testConnection(url = null) {
        try {
            const testUrl = url || config.url;
            if (!testUrl) return false;

            const response = await fetch(testUrl, {
                method: 'OPTIONS',
                mode: 'cors'
            });

            return response.ok || response.status === 204;
        } catch (error) {
            console.warn('Verbindungstest fehlgeschlagen:', error.message);
            return false;
        }
    }

    /**
     * Benutzerdefinierter API-Fehler
     */
    class APIError extends Error {
        constructor(message, status, data) {
            super(message);
            this.name = 'APIError';
            this.status = status;
            this.data = data;
        }
    }

    /**
     * Gibt die aktuelle Konfiguration zurück
     * @returns {Object}
     */
    function getConfig() {
        return { ...config };
    }

    // Public API
    return {
        configure,
        send,
        testConnection,
        getConfig,
        APIError
    };
})();

// Export für ES6-Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}
