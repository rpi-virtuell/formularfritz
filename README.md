# AMB Form Editor - Formular-Fritz

Ein modulares Formular-System zur Erfassung von Bildungsressourcen-Metadaten nach dem [AMB-Standard](https://dini-ag-kim.github.io/amb/) mit n8n-Integration.

## 🎯 Features

- **Modulare Architektur**: Getrennte Module für Parsing, Formular-Generierung, JSON-Building und API-Kommunikation
- **MD-basierte Konfiguration**: Formularstruktur und Vorausfülldaten werden aus menschenlesbaren Markdown-Dateien geladen
- **AMB-konform**: Pflichtfelder und Validierung nach AMB-Standard
- **n8n-Integration**: Direktes Senden an n8n-Webhooks
- **URL-Parameter**: Formular kann mit vordefinierten Config/Data-URLs aufgerufen werden
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Dark Mode**: Automatische Anpassung an System-Präferenz

## 📁 Projektstruktur

```
form-editor/
├── index.html              # Haupt-HTML
├── css/
│   └── form-editor.css     # Styling (CSS Custom Properties)
├── js/
│   ├── md-parser.js        # Markdown-Parser Modul
│   ├── form-generator.js   # Formular-Generator Modul
│   ├── json-builder.js     # JSON-Builder & Validator Modul
│   └── api-client.js       # API-Client Modul (n8n)
├── config/
│   └── form-config.md      # Formular-Konfiguration
└── data/
    └── example-entry.md    # Beispiel-Vorausfülldaten
```

## 🚀 Verwendung

### Lokal starten

```bash
# Mit Python
cd form-editor
python -m http.server 8000

# Mit Node.js
npx serve .

# Mit PHP
php -S localhost:8000
```

Dann öffnen: http://localhost:8000

### URL-Parameter

Das Formular unterstützt URL-Parameter für automatisches Laden:

```
index.html?config=config/form-config.md&data=data/example-entry.md
```

**Parameter:**
- `config` - URL zur Konfigurations-MD (Felder, Endpoint, Defaults)
- `data` - URL zur Daten-MD (Werte zum Vorausfüllen)

### Externe URLs (z.B. Forgejo)

```
index.html?config=https://git.example.org/repo/raw/main/form-config.md&data=https://git.example.org/repo/raw/main/entry-123.md
```

## 📝 MD-Format

### Konfigurations-Datei (form-config.md)

```markdown
# Formular-Titel

## Endpoint
- URL: https://n8n.example.com/webhook/xyz
- Method: POST
- ContentType: application/json

## Felder

### feldname
- Label: Angezeigter Name
- Typ: text|url|textarea|date|email|select
- Pflicht: ja|nein
- Placeholder: Platzhaltertext
- Hilfe: Hilfetext unter dem Feld

## Defaults

### @context
- Wert: ["https://w3id.org/kim/amb/context.jsonld"]

### type
- Wert: ["LearningResource"]
```

### Daten-Datei (example-entry.md)

```markdown
# Eintrag: Titel

## Werte

### id
- Wert: https://example.org/resource/123

### name
- Wert: Titel der Ressource
```

## 🔧 Module

### MDParser

```javascript
// Markdown parsen
const config = MDParser.parse(markdownString);

// Von URL laden
const config = await MDParser.loadFromURL('config/form-config.md');

// Config und Data mergen
const merged = MDParser.mergeConfigAndData(config, data);
```

### FormGenerator

```javascript
// Formular generieren
const form = FormGenerator.generate(config, containerElement);

// Formular mit Werten füllen
FormGenerator.fillForm(form, values);

// Werte auslesen
const values = FormGenerator.getFormValues(form);
```

### JSONBuilder

```javascript
// AMB-JSON bauen
const json = JSONBuilder.build(formValues, defaults);

// Validieren
const result = JSONBuilder.validate(json);
// { valid: true/false, errors: [] }

// Formatieren
const formatted = JSONBuilder.format(json);
```

### APIClient

```javascript
// Konfigurieren
APIClient.configure({
    url: 'https://n8n.example.com/webhook/xyz',
    method: 'POST'
});

// Senden
const response = await APIClient.send(jsonData);
```

## 🛡️ AMB-Pflichtfelder

Nach dem [AMB-Standard](https://dini-ag-kim.github.io/amb/) sind folgende Felder Pflicht:

| Feld | Beschreibung |
|------|--------------|
| `@context` | Muss `https://w3id.org/kim/amb/context.jsonld` enthalten |
| `id` | Dereferenzierbare HTTP-URI der Ressource |
| `type` | Muss `LearningResource` enthalten |
| `name` | Titel der Ressource |

## 📋 Nächste Schritte (Roadmap)

### Phase 2: Erweiterung
- [ ] Dynamische Feldtypen aus MD
- [ ] Feldvalidierung mit RegEx aus MD
- [ ] Mehrere Formulare in einer Ansicht
- [ ] Checkbox- und Radio-Gruppen

### Phase 3: Vollständige Modularität
- [ ] Plugin-System für Feldtypen
- [ ] Template-System
- [ ] Mehrsprachigkeit
- [ ] Lokaler Speicher (localStorage)

## 📄 Lizenz

MIT
