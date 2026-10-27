// Freundschaften – kompatible Version für den GraphDB-Haupteditor
// Originaldaten unverändert; Neo4j-Constraints/UNWIND/MERGE/SET wurden aufgelöst.
// Achtung: Skript nur einmal auf leerem Graph ausführen; CREATE ist nicht idempotent.
// Datum als ISO-String, da der Prototyp keine date()-Funktion unterstützt.
// Einfügen oder Datei öffnen und auf «Ausführen» klicken.

// Person
CREATE (:Person {name:'Anna', age:17});
CREATE (:Person {name:'Max', age:17});
CREATE (:Person {name:'Lara', age:18});
CREATE (:Person {name:'Ben', age:17});
CREATE (:Person {name:'Sofia', age:16});
CREATE (:Person {name:'Amir', age:18});
CREATE (:Person {name:'Lea', age:17});
CREATE (:Person {name:'Tom', age:16});
CREATE (:Person {name:'Mia', age:17});
CREATE (:Person {name:'Jonas', age:18});
CREATE (:Person {name:'Nina', age:17});
CREATE (:Person {name:'Paul', age:16});

// City
CREATE (:City {name:'Zürich'});
CREATE (:City {name:'Bern'});
CREATE (:City {name:'Basel'});

// Hobby
CREATE (:Hobby {name:'Schach'});
CREATE (:Hobby {name:'Klettern'});
CREATE (:Hobby {name:'Musik'});
CREATE (:Hobby {name:'Coding'});
CREATE (:Hobby {name:'Fussball'});
CREATE (:Hobby {name:'Lesen'});

// Company
CREATE (:Company {name:'GraphLabs AG'});
CREATE (:Company {name:'EduTech GmbH'});
CREATE (:Company {name:'AlpenBank'});

// Event
CREATE (:Event {id:'E1', title:'HackNight', date:'2025-09-20'});
CREATE (:Event {id:'E2', title:'Klettercup', date:'2025-10-05'});
CREATE (:Event {id:'E3', title:'Stadtlauf Basel', date:'2025-09-28'});

// Wohnorte
MATCH (a:Person {name:'Anna'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Max'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Lara'}), (b:City {name:'Bern'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Ben'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Sofia'}), (b:City {name:'Basel'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Amir'}), (b:City {name:'Bern'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Lea'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Tom'}), (b:City {name:'Basel'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Mia'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Jonas'}), (b:City {name:'Bern'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Nina'}), (b:City {name:'Zürich'}) CREATE (a)-[:LIVES_IN]->(b);
MATCH (a:Person {name:'Paul'}), (b:City {name:'Basel'}) CREATE (a)-[:LIVES_IN]->(b);

// Hobbys
MATCH (a:Person {name:'Anna'}), (b:Hobby {name:'Schach'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Anna'}), (b:Hobby {name:'Lesen'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Max'}), (b:Hobby {name:'Coding'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Max'}), (b:Hobby {name:'Musik'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Lara'}), (b:Hobby {name:'Klettern'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Ben'}), (b:Hobby {name:'Fussball'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Sofia'}), (b:Hobby {name:'Musik'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Amir'}), (b:Hobby {name:'Coding'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Lea'}), (b:Hobby {name:'Lesen'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Tom'}), (b:Hobby {name:'Klettern'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Mia'}), (b:Hobby {name:'Schach'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Jonas'}), (b:Hobby {name:'Fussball'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Nina'}), (b:Hobby {name:'Coding'}) CREATE (a)-[:LIKES]->(b);
MATCH (a:Person {name:'Paul'}), (b:Hobby {name:'Musik'}) CREATE (a)-[:LIKES]->(b);

// Arbeit
MATCH (a:Person {name:'Anna'}), (b:Company {name:'EduTech GmbH'}) CREATE (a)-[:WORKS_AT]->(b);
MATCH (a:Person {name:'Max'}), (b:Company {name:'GraphLabs AG'}) CREATE (a)-[:WORKS_AT]->(b);
MATCH (a:Person {name:'Lara'}), (b:Company {name:'AlpenBank'}) CREATE (a)-[:WORKS_AT]->(b);
MATCH (a:Person {name:'Amir'}), (b:Company {name:'GraphLabs AG'}) CREATE (a)-[:WORKS_AT]->(b);
MATCH (a:Person {name:'Nina'}), (b:Company {name:'EduTech GmbH'}) CREATE (a)-[:WORKS_AT]->(b);

// Veranstaltungsorte
MATCH (a:Event {id:'E1'}), (b:City {name:'Zürich'}) CREATE (a)-[:IN_CITY]->(b);
MATCH (a:Event {id:'E2'}), (b:City {name:'Bern'}) CREATE (a)-[:IN_CITY]->(b);
MATCH (a:Event {id:'E3'}), (b:City {name:'Basel'}) CREATE (a)-[:IN_CITY]->(b);

// Teilnahme
MATCH (a:Person {name:'Anna'}), (b:Event {id:'E1'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Max'}), (b:Event {id:'E1'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Amir'}), (b:Event {id:'E1'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Nina'}), (b:Event {id:'E1'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Lara'}), (b:Event {id:'E2'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Tom'}), (b:Event {id:'E2'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Ben'}), (b:Event {id:'E3'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Paul'}), (b:Event {id:'E3'}) CREATE (a)-[:ATTENDS]->(b);
MATCH (a:Person {name:'Sofia'}), (b:Event {id:'E3'}) CREATE (a)-[:ATTENDS]->(b);

// Freundschaften (gerichtet)
MATCH (a:Person {name:'Anna'}), (b:Person {name:'Max'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Anna'}), (b:Person {name:'Lara'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Max'}), (b:Person {name:'Ben'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Max'}), (b:Person {name:'Mia'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Lara'}), (b:Person {name:'Amir'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Ben'}), (b:Person {name:'Sofia'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Sofia'}), (b:Person {name:'Tom'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Tom'}), (b:Person {name:'Paul'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Mia'}), (b:Person {name:'Lea'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Lea'}), (b:Person {name:'Nina'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Jonas'}), (b:Person {name:'Lara'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Nina'}), (b:Person {name:'Anna'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Paul'}), (b:Person {name:'Jonas'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Ben'}), (b:Person {name:'Mia'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Amir'}), (b:Person {name:'Nina'}) CREATE (a)-[:KNOWS]->(b);
MATCH (a:Person {name:'Mia'}), (b:Person {name:'Anna'}) CREATE (a)-[:KNOWS]->(b);

// Alle Knoten anzeigen
MATCH (n) RETURN n;
