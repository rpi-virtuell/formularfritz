# Formular-Konfiguration (AMB Minimal)

Diese Datei definiert die Struktur des Formulars für Basis-Metadaten.

## Endpoint

- URL: https://n8n.example.com/webhook/amb-metadata
- Method: POST
- ContentType: application/json

## Felder

### id
- Label: Ressourcen-ID (URL)
- Typ: url
- Pflicht: ja
- Placeholder: https://example.org/resource/123
- Hilfe: Ein dereferenzierbarer HTTP-URI, der die Bildungsressource eindeutig identifiziert.

### name
- Label: Titel
- Typ: text
- Pflicht: ja
- Placeholder: Titel der Bildungsressource
- Hilfe: Der Titel der Ressource.

### description
- Label: Beschreibung
- Typ: textarea
- Pflicht: nein
- Placeholder: Eine kurze Beschreibung der Bildungsressource...
- Hilfe: Beschreibung der Bildungsressource.

### image
- Label: Vorschaubild (URL)
- Typ: url
- Pflicht: nein
- Placeholder: https://example.org/images/thumbnail.jpg
- Hilfe: URL zu einem Thumbnail der Ressource.

## Defaults

Diese Werte werden automatisch im JSON gesetzt:

### @context
- Wert: https://schema.org/

### type
- Wert: LearningResource
