# AMB Metadaten Editor - Anleitung

Ein webbasierter Editor zur Erstellung von AMB-konformen Metadaten für Bildungsressourcen.

## Funktionsweise

Der Editor besteht aus zwei Dateien:

- **editorprobe.html** - Die Editor-Anwendung (enthält alle Funktionen)
- **editorconfig.md** - Die Konfigurationsdatei (enthält Religionsoptionen und Schlagworte)

Die HTML-Datei lädt beim Start automatisch die Markdown-Konfiguration und baut daraus die Benutzeroberfläche auf.

## Verwendung

### Online (empfohlen)

Der Editor ist verfügbar unter:
**https://rpi-virtuell.github.io/FOERBICO_und_rpi-virtuell/editorprobe.html**

Die Konfiguration wird automatisch von folgender URL geladen:
https://git.rpi-virtuell.de/Comenius-Institut/FOERBICO_und_rpi-virtuell/raw/branch/main/docs/editorconfig.md

### Lokal

Starten Sie einen lokalen Webserver im Verzeichnis:

```bash
cd /Users/joerglohrer/repositories/editorprobe
python3 -m http.server 8000
```

Öffnen Sie im Browser: **http://localhost:8000/editorprobe.html**

> **Hinweis:** Direktes Öffnen der HTML-Datei (`file:///`) funktioniert nicht, da Browser aus Sicherheitsgründen keine lokalen Dateien per fetch() laden können.

## Bedienung

### 1. Allgemeine Angaben

- **@context**: Wählen Sie die Sprache (Deutsch/Englisch) und ob schema.org ergänzt werden soll
- **Ressourcen-ID**: Eindeutige URL der Bildungsressource (Pflichtfeld)
- **Titel**: Name der Ressource (Pflichtfeld)
- **Beschreibung**: Optional, ausführliche Beschreibung

### 2. Fach

- Das Fach "Religion" ist fest gesetzt
- Optional können spezifische Zielrichtungen gewählt werden (z.B. Evangelisch, Katholisch)

### 3. Schlagworte

- Kategorien können durch Klick auf den Pfeil (▶) ausgeklappt werden
- Parent-Schlagwort wird automatisch ausgewählt, wenn ein Kind-Schlagwort gewählt wird
- **Freitext**: Eigene Schlagworte können kommagetrennt eingegeben werden

### 4. JSON erzeugen

1. Klicken Sie auf **"JSON erzeugen"**
2. Das Metadaten-JSON wird unter "Erzeugtes JSON" angezeigt
3. Mit **"JSON herunterladen"** speichern Sie es als `amb-metadata.json`

## Konfiguration anpassen

Die Datei `editorconfig.md` kann angepasst werden:

### Religion-Optionen hinzufügen

```markdown
## Religion

- [Neuer Religionsunterricht](https://example.org/vocab/religion/neu): Neuer Religionsunterricht
```

Format: `- [Label](URL): Label`

### Schlagworte anpassen

```markdown
## Schlagworte

### Neue Kategorie
- Unterpunkt 1
- Unterpunkt 2
- Unterpunkt 3
```

### Externe URL verwenden

In der HTML-Datei ist die Konfiguration bereits gesetzt:

```javascript
const CONFIG_URL = 'https://git.rpi-virtuell.de/Comenius-Institut/FOERBICO_und_rpi-virtuell/raw/branch/main/docs/editorconfig.md';
```

Um die Konfiguration anzupassen, bearbeiten Sie die Datei im Repository:
https://git.rpi-virtuell.de/Comenius-Institut/FOERBICO_und_rpi-virtuell/src/branch/main/docs/editorconfig.md

## Ausgabeformat

Das erzeugte JSON folgt dem AMB-Standard:

```json
{
  "@context": [
    "https://w3id.org/kim/amb/context.jsonld",
    { "@language": "de" }
  ],
  "id": "https://example.org/resource/123",
  "type": ["LearningResource"],
  "name": "Titel der Ressource",
  "description": "Beschreibung...",
  "about": [
    {
      "id": "https://example.org/vocab/school-subject/religion",
      "type": "Concept",
      "prefLabel": { "de": "Religion" }
    }
  ],
  "keywords": ["Gott", "Gottesbilder", ...]
}
```

## Technische Details

- **Keine Abhängigkeiten**: Funktioniert standalone (außer marked.js vom CDN)
- **Vanilla JavaScript**: Kein Framework erforderlich
- **Markdown-Parser**: Einfacher eigener Parser für die Konfiguration
- **Responsive**: Funktioniert auf Desktop und Tablet

## Lizenz

CC0 - Frei verwendbar für Bildungszwecke.
