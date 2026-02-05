# Formular-Konfiguration (AMB Erweitert)

Diese erweiterte Konfiguration enthält mehr Felder für umfassendere Metadaten.

## Endpoint

- URL: https://n8n.example.com/webhook/amb-metadata-extended
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

### keywords
- Label: Schlagworte
- Typ: text
- Pflicht: nein
- Placeholder: Reformation, Luther, Kirche
- Hilfe: Kommagetrennte Schlagworte zur Beschreibung des Inhalts.

### inLanguage
- Label: Sprache
- Typ: select
- Pflicht: nein
- Options: de|Deutsch, en|Englisch, fr|Französisch, es|Spanisch
- Hilfe: Sprache der Bildungsressource (BCP47).

### dateCreated
- Label: Erstellungsdatum
- Typ: date
- Pflicht: nein
- Hilfe: Datum der Erstellung (YYYY-MM-DD).

### datePublished
- Label: Veröffentlichungsdatum
- Typ: date
- Pflicht: nein
- Hilfe: Datum der Veröffentlichung (YYYY-MM-DD).

### creator
- Label: Urheber/in
- Typ: text
- Pflicht: nein
- Placeholder: Max Mustermann
- Hilfe: Name der Person oder Organisation, die die Ressource erstellt hat.

### publisher
- Label: Herausgeber
- Typ: text
- Pflicht: nein
- Placeholder: Bildungsverlag XY
- Hilfe: Organisation oder Person, die die Ressource veröffentlicht.

## Defaults

Diese Werte werden automatisch im JSON gesetzt:

### @context
- Wert: ["https://w3id.org/kim/amb/context.jsonld", {"@language": "de"}]

### type
- Wert: ["LearningResource"]
