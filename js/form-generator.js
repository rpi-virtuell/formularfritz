/**
 * Form Generator Modul
 * Generiert HTML-Formulare aus geparstem MD-Config
 * 
 * @module FormGenerator
 */

const FormGenerator = (function() {
    'use strict';

    /**
     * Generiert ein HTML-Formular basierend auf der Konfiguration
     * @param {Object} config - Geparstes Config-Objekt
     * @param {HTMLElement} container - Container-Element für das Formular
     */
    function generate(config, container) {
        const form = document.createElement('form');
        form.id = 'amb-form';
        form.className = 'amb-form';

        // Titel
        if (config.title) {
            const title = document.createElement('h2');
            title.textContent = config.title;
            form.appendChild(title);
        }

        // Felder generieren
        for (const fieldName in config.fields) {
            const fieldConfig = config.fields[fieldName];
            const fieldElement = createField(fieldName, fieldConfig);
            form.appendChild(fieldElement);
        }

        // Button-Container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Preview-Button
        const previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.id = 'preview-btn';
        previewBtn.textContent = 'JSON Vorschau';
        previewBtn.className = 'btn btn-secondary';
        buttonContainer.appendChild(previewBtn);

        // Validate-Button
        const validateBtn = document.createElement('button');
        validateBtn.type = 'button';
        validateBtn.id = 'validate-btn';
        validateBtn.textContent = 'Validieren';
        validateBtn.className = 'btn btn-info';
        buttonContainer.appendChild(validateBtn);

        // Submit-Button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.id = 'submit-btn';
        submitBtn.textContent = 'An n8n senden';
        submitBtn.className = 'btn btn-primary';
        buttonContainer.appendChild(submitBtn);

        form.appendChild(buttonContainer);

        // Container leeren und Formular einfügen
        container.innerHTML = '';
        container.appendChild(form);

        return form;
    }

    /**
     * Erstellt ein einzelnes Formularfeld
     * @param {string} name - Feldname
     * @param {Object} config - Feldkonfiguration
     * @returns {HTMLElement} Fieldset-Element
     */
    function createField(name, config) {
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'form-field';
        fieldset.dataset.field = name;

        // Legend mit Label
        const legend = document.createElement('legend');
        legend.innerHTML = config.label || name;
        if (config.pflicht || config.required) {
            legend.innerHTML += ' <span class="required">*</span>';
        }
        fieldset.appendChild(legend);

        // Input-Element basierend auf Typ
        let input;
        const inputType = (config.typ || config.type || 'text').toLowerCase();

        switch (inputType) {
            case 'textarea':
                input = document.createElement('textarea');
                input.rows = config.rows || 4;
                break;
            case 'select':
                input = document.createElement('select');
                if (config.options) {
                    // Options können Array oder String sein
                    let options = config.options;
                    if (typeof options === 'string') {
                        // Fallback: String parsen
                        options = options.split(',').map(item => {
                            const trimmed = item.trim();
                            if (trimmed.includes('|')) {
                                const [value, label] = trimmed.split('|').map(s => s.trim());
                                return { value, label };
                            }
                            return { value: trimmed, label: trimmed };
                        });
                    }
                    
                    options.forEach(opt => {
                        const option = document.createElement('option');
                        if (typeof opt === 'object') {
                            option.value = opt.value || opt.id || '';
                            option.textContent = opt.label || opt.name || opt.value || '';
                        } else {
                            option.value = opt;
                            option.textContent = opt;
                        }
                        input.appendChild(option);
                    });
                }
                break;
            case 'url':
                input = document.createElement('input');
                input.type = 'url';
                break;
            case 'date':
                input = document.createElement('input');
                input.type = 'date';
                break;
            case 'email':
                input = document.createElement('input');
                input.type = 'email';
                break;
            default:
                input = document.createElement('input');
                input.type = 'text';
        }

        // Gemeinsame Attribute
        input.id = `field-${name}`;
        input.name = name;
        
        if (config.placeholder) {
            input.placeholder = config.placeholder;
        }
        if (config.pflicht || config.required) {
            input.required = true;
        }
        if (config.value || config.wert) {
            input.value = config.value || config.wert;
        }

        fieldset.appendChild(input);

        // Hilfetext
        if (config.hilfe || config.help) {
            const help = document.createElement('small');
            help.className = 'help-text';
            help.textContent = config.hilfe || config.help;
            fieldset.appendChild(help);
        }

        // Validierungs-Feedback
        const feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        fieldset.appendChild(feedback);

        return fieldset;
    }

    /**
     * Füllt ein bestehendes Formular mit Werten
     * @param {HTMLFormElement} form - Das Formular
     * @param {Object} values - Objekt mit Feldname: Wert
     */
    function fillForm(form, values) {
        for (const fieldName in values) {
            const input = form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                const value = values[fieldName].wert || values[fieldName].value || values[fieldName];
                input.value = value;
            }
        }
    }

    /**
     * Liest alle Formularwerte aus
     * @param {HTMLFormElement} form - Das Formular
     * @returns {Object} Objekt mit allen Feldwerten
     */
    function getFormValues(form) {
        const values = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.name) {
                values[input.name] = input.value;
            }
        });

        return values;
    }

    // Public API
    return {
        generate,
        createField,
        fillForm,
        getFormValues
    };
})();

// Export für ES6-Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormGenerator;
}
