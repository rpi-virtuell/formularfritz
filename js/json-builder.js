/**
 * JSON Builder Modul
 * Baut AMB-konforme JSON-Objekte aus Formularwerten
 * 
 * @module JSONBuilder
 */

const JSONBuilder = (function() {
    'use strict';

    // Standard AMB-Context
    const DEFAULT_CONTEXT = [
        "https://w3id.org/kim/amb/context.jsonld",
        { "@language": "de" }
    ];

    // Standard-Typ
    const DEFAULT_TYPE = ["LearningResource"];

    /**
     * Baut ein AMB-konformes JSON-Objekt
     * @param {Object} formValues - Werte aus dem Formular
     * @param {Object} defaults - Default-Werte aus der Config
     * @returns {Object} AMB-konformes JSON-Objekt
     */
    function build(formValues, defaults = {}) {
        const json = {
            "@context": DEFAULT_CONTEXT,
            "id": formValues.id || "",
            "type": DEFAULT_TYPE,
            "name": formValues.name || ""
        };

        // Optionale Felder nur hinzufügen wenn nicht leer
        if (formValues.description && formValues.description.trim()) {
            json.description = formValues.description.trim();
        }

        if (formValues.image && formValues.image.trim()) {
            json.image = formValues.image.trim();
        }

        // Defaults anwenden (überschreibt Formularwerte nicht)
        if (defaults['@context']?.wert) {
            try {
                json['@context'] = typeof defaults['@context'].wert === 'string' 
                    ? JSON.parse(defaults['@context'].wert)
                    : defaults['@context'].wert;
            } catch (e) {
                // Behalte Default
            }
        }

        if (defaults.type?.wert) {
            try {
                json.type = typeof defaults.type.wert === 'string'
                    ? JSON.parse(defaults.type.wert)
                    : defaults.type.wert;
            } catch (e) {
                // Behalte Default
            }
        }

        return json;
    }

    /**
     * Validiert ein JSON-Objekt gegen AMB-Pflichtfelder
     * @param {Object} json - Das zu validierende JSON-Objekt
     * @returns {Object} Validierungsergebnis { valid: boolean, errors: string[] }
     */
    function validate(json) {
        const errors = [];

        // Pflichtfeld: @context
        if (!json['@context']) {
            errors.push('@context ist ein Pflichtfeld');
        } else if (!Array.isArray(json['@context'])) {
            errors.push('@context muss ein Array sein');
        } else if (!json['@context'].includes('https://w3id.org/kim/amb/context.jsonld')) {
            errors.push('@context muss "https://w3id.org/kim/amb/context.jsonld" enthalten');
        }

        // Pflichtfeld: id
        if (!json.id) {
            errors.push('id ist ein Pflichtfeld');
        } else if (!isValidURL(json.id)) {
            errors.push('id muss eine gültige URL sein');
        }

        // Pflichtfeld: type
        if (!json.type) {
            errors.push('type ist ein Pflichtfeld');
        } else if (!Array.isArray(json.type)) {
            errors.push('type muss ein Array sein');
        } else if (!json.type.includes('LearningResource')) {
            errors.push('type muss "LearningResource" enthalten');
        }

        // Pflichtfeld: name
        if (!json.name || !json.name.trim()) {
            errors.push('name ist ein Pflichtfeld');
        }

        // Optionale Validierungen
        if (json.image && !isValidURL(json.image)) {
            errors.push('image muss eine gültige URL sein');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Prüft ob ein String eine gültige URL ist
     * @param {string} str - Der zu prüfende String
     * @returns {boolean}
     */
    function isValidURL(str) {
        try {
            const url = new URL(str);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    /**
     * Formatiert JSON für die Anzeige
     * @param {Object} json - Das JSON-Objekt
     * @param {number} indent - Einrückung (Standard: 2)
     * @returns {string} Formatierter JSON-String
     */
    function format(json, indent = 2) {
        return JSON.stringify(json, null, indent);
    }

    /**
     * Erstellt eine Vorschau mit Syntax-Highlighting
     * @param {Object} json - Das JSON-Objekt
     * @returns {string} HTML-String mit Highlighting
     */
    function formatWithHighlighting(json) {
        const formatted = format(json);
        return formatted
            .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
            .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
            .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/: (null)/g, ': <span class="json-null">$1</span>');
    }

    // Public API
    return {
        build,
        validate,
        format,
        formatWithHighlighting,
        isValidURL,
        DEFAULT_CONTEXT,
        DEFAULT_TYPE
    };
})();

// Export für ES6-Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONBuilder;
}
