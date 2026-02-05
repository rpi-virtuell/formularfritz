# Formular-Konfiguration (Minimal-Test)

Nur die absolut notwendigen Pflichtfelder zum schnellen Testen.

## Endpoint

- URL: https://n8n.example.com/webhook/amb-minimal
- Method: POST
- ContentType: application/json

## Felder

### id
- Label: Ressourcen-URL
- Typ: url
- Pflicht: ja
- Placeholder: https://example.org/ressource
- Hilfe: Die eindeutige URL der Bildungsressource.

### name
- Label: Titel
- Typ: text
- Pflicht: ja
- Placeholder: Titel eingeben
- Hilfe: Der Titel der Ressource (Pflichtfeld).

## Defaults

### @context
- Wert: https://schema.org/

### type
- Wert: LearningResource
