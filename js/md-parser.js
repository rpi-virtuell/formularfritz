/**
 * MD-Parser Modul
 * Parst Markdown-Konfigurationsdateien für das Formular-System
 * 
 * @module MDParser
 */

const MDParser = (function() {
    'use strict';

    /**
     * Parst einen Options-String im Format "value|label, value|label, ..."
     * @param {string} str - Der Options-String
     * @returns {Array} Array von Option-Objekten
     */
    function parseOptionsString(str) {
        if (!str || typeof str !== 'string') return [];
        
        return str.split(',').map(item => {
            const trimmed = item.trim();
            if (trimmed.includes('|')) {
                const [value, label] = trimmed.split('|').map(s => s.trim());
                return { value, label };
            } else {
                return { value: trimmed, label: trimmed };
            }
        }).filter(opt => opt.value); // Leere entfernen
    }

    /**
     * Parst eine Markdown-Datei und extrahiert strukturierte Daten
     * @param {string} markdown - Der Markdown-Inhalt
     * @returns {Object} Geparstes Objekt mit Sektionen
     */
    function parse(markdown) {
        const lines = markdown.split('\n');
        const result = {
            title: '',
            endpoint: {},
            fields: {},
            defaults: {},
            values: {}
        };

        let currentSection = null;
        let currentField = null;
        let currentSubSection = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Haupttitel (# ...)
            if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
                result.title = trimmed.substring(2).trim();
                continue;
            }

            // Sektion (## ...)
            if (trimmed.startsWith('## ')) {
                currentSection = trimmed.substring(3).trim().toLowerCase();
                currentField = null;
                currentSubSection = null;
                continue;
            }

            // Feld/Subsektion (### ...)
            if (trimmed.startsWith('### ')) {
                currentField = trimmed.substring(4).trim();
                
                if (currentSection === 'felder' || currentSection === 'fields') {
                    result.fields[currentField] = {};
                } else if (currentSection === 'defaults') {
                    result.defaults[currentField] = {};
                } else if (currentSection === 'werte' || currentSection === 'values') {
                    result.values[currentField] = {};
                }
                continue;
            }

            // Property (- Key: Value)
            if (trimmed.startsWith('- ') && trimmed.includes(':')) {
                const colonIndex = trimmed.indexOf(':');
                const key = trimmed.substring(2, colonIndex).trim().toLowerCase();
                let value = trimmed.substring(colonIndex + 1).trim();

                // JSON-Arrays parsen
                if (value.startsWith('[') && value.endsWith(']')) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // Belasse als String wenn kein gültiges JSON
                    }
                }

                // Options-Format parsen: "value|label, value|label, ..."
                if (key === 'options' && typeof value === 'string') {
                    value = parseOptionsString(value);
                }

                // Boolean-Werte konvertieren
                if (value === 'ja' || value === 'yes' || value === 'true') {
                    value = true;
                } else if (value === 'nein' || value === 'no' || value === 'false') {
                    value = false;
                }

                // Zuweisung zur richtigen Struktur
                if (currentSection === 'endpoint') {
                    result.endpoint[key] = value;
                } else if ((currentSection === 'felder' || currentSection === 'fields') && currentField) {
                    result.fields[currentField][key] = value;
                } else if (currentSection === 'defaults' && currentField) {
                    result.defaults[currentField][key] = value;
                } else if ((currentSection === 'werte' || currentSection === 'values') && currentField) {
                    result.values[currentField][key] = value;
                }
            }
        }

        return result;
    }

    /**
     * Lädt eine MD-Datei von einer URL
     * @param {string} url - URL zur MD-Datei
     * @returns {Promise<Object>} Geparstes Objekt
     */
    async function loadFromURL(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const markdown = await response.text();
            return parse(markdown);
        } catch (error) {
            console.error('Fehler beim Laden der MD-Datei:', error);
            throw error;
        }
    }

    /**
     * Lädt eine MD-Datei aus einem lokalen File-Input
     * @param {File} file - File-Objekt vom Input
     * @returns {Promise<Object>} Geparstes Objekt
     */
    async function loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = parse(e.target.result);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Merged Config und Data zu einem kombinierten Objekt
     * @param {Object} config - Konfiguration (Felder, Endpoint, Defaults)
     * @param {Object} data - Daten (Werte zum Vorausfüllen)
     * @returns {Object} Kombiniertes Objekt
     */
    function mergeConfigAndData(config, data) {
        const merged = {
            title: config.title || data.title || 'Formular',
            endpoint: config.endpoint || {},
            fields: { ...config.fields },
            defaults: { ...config.defaults },
            values: { ...data.values }
        };

        // Werte aus data.values in die Felder übernehmen
        for (const fieldName in merged.values) {
            if (merged.fields[fieldName]) {
                merged.fields[fieldName].value = merged.values[fieldName].wert || merged.values[fieldName].value;
            }
        }

        return merged;
    }

    // Public API
    return {
        parse,
        loadFromURL,
        loadFromFile,
        mergeConfigAndData
    };
})();

// Export für ES6-Module (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MDParser;
}
