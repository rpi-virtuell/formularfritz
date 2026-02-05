/**
 * JSON Builder Modul
 * Baut JSON-LD Objekte aus Formularwerten
 * 
 * @module JSONBuilder
 */

const JSONBuilder = (function() {
    'use strict';

    // Standard Context
    const DEFAULT_CONTEXT = "https://schema.org/";

    // Standard-Typ
    const DEFAULT_TYPE = "LearningResource";

    /**
     * Baut ein JSON-LD Objekt
     * @param {Object} formValues - Werte aus dem Formular
     * @param {Object} defaults - Default-Werte aus der Config
     * @returns {Object} JSON-LD Objekt
     */
    function build(formValues, defaults = {}) {
        const json = {
            "@context": DEFAULT_CONTEXT,
            "creativeWorkStatus": "Published",
            "type": DEFAULT_TYPE,
            "id": formValues.id || "",
            "name": formValues.name || ""
        };

        // Optionale Felder nur hinzufügen wenn nicht leer
        if (formValues.description && formValues.description.trim()) {
            json.description = formValues.description.trim();
        }

        if (formValues.image && formValues.image.trim()) {
            json.image = formValues.image.trim();
        }

        // Keywords als Array (kommagetrennt)
        if (formValues.keywords && formValues.keywords.trim()) {
            json.keywords = formValues.keywords
                .split(',')
                .map(kw => kw.trim())
                .filter(kw => kw);
        }

        // License
        if (formValues.license && formValues.license.trim()) {
            json.license = formValues.license.trim();
        } else {
            json.license = "https://creativecommons.org/publicdomain/zero/1.0/deed.de";
        }

        // Learning Resource Type
        if (formValues.learningResourceType && formValues.learningResourceType.trim()) {
            json.learningResourceType = [formValues.learningResourceType.trim()];
        }

        // Educational Level (Array)
        if (formValues.educationalLevel && formValues.educationalLevel.trim()) {
            json.educationalLevel = formValues.educationalLevel
                .split(',')
                .map(level => level.trim())
                .filter(level => level);
        }

        // Creator
        if (formValues.creator && formValues.creator.trim()) {
            json.creator = formValues.creator.trim();
        }

        // Publisher
        if (formValues.publisher && formValues.publisher.trim()) {
            json.publisher = formValues.publisher.trim();
        }

        // Dates
        if (formValues.dateCreated && formValues.dateCreated.trim()) {
            json.dateCreated = formValues.dateCreated.trim();
        }

        if (formValues.datePublished && formValues.datePublished.trim()) {
            json.datePublished = formValues.datePublished.trim();
        }

        // Defaults anwenden (nur wenn in Config überschrieben)
        if (defaults['@context']?.wert) {
            json['@context'] = defaults['@context'].wert;
        }

        if (defaults.type?.wert) {
            json.type = defaults.type.wert;
        }

        return json;
    }

    /**
     * Validiert ein JSON-Objekt gegen Pflichtfelder
     * @param {Object} json - Das zu validierende JSON-Objekt
     * @returns {Object} Validierungsergebnis { valid: boolean, errors: string[] }
     */
    function validate(json) {
        const errors = [];

        // Pflichtfeld: @context
        if (!json['@context']) {
            errors.push('@context ist ein Pflichtfeld');
        } else if (typeof json['@context'] !== 'string') {
            errors.push('@context muss ein String sein');
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
        } else if (typeof json.type !== 'string') {
            errors.push('type muss ein String sein');
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
