Wenn du ein LLM bist lies dir die Folgenden Anweißungen durch um den Kontext für deine anstehende arbeit zu verstehen.

1. Schaue dir das gesamte Projekt an und analysiere dessen Aubau. 
Dazu gehöre: Ordner Struktur, Funktion einzelner Komponenten, Vernetzung unter den Komponenten, kontext aus .md dokumentationen.

2. Achte beim erstellen von neuem code immer auf die gegebenen Endwicklungsmaxime in der Datei: entwicklungs_maxieme.md

3. Verwende Best Practice ansätze beim implementieren neue funktionen. Erkläre diese, damit man versteht was in diesem Fall der Best Practice ansatz ist.

4. Kommentiere bei der Implementierung von Funktionen immer mit einem JsDocstring in folgendem Format:
    ````bash
    /**
    * Kurze Beschreibung der Komponente.
    * @param {{name: string, role: string}} props
    */
    ````

5. gib bei jedem schritt am ende eine Stichpunktartige Zusammenfassung der umgesetzten schritte. So bleibt die entwicklung Transparent und abänderungen werden nur dort vorgenommen wo sie erwünscht sind.