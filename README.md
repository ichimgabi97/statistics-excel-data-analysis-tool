Aplicație de 'Analiză și Notificare Plăți'

Această aplicație permite utilizatorilor să încarce fișiere CSV cu date de plată, să vizualizeze statistici relevante și să genereze remindere personalizate pentru utilizatorii cu plăți restante.


🚀 Funcționalități Principale

Aplicația este împărțită în două părți principale: un backend Python cu Flask și un frontend React cu TypeScript.


1. Încărcare Fișier CSV (cu Drag & Drop)
   
Interfață intuitivă: O zonă de încărcare cu suport pentru drag-and-drop sau selecție din fișiere.

Validare: Asigură că doar fișierele cu extensia .csv sunt acceptate.

Stocare temporară: Fișierul CSV este salvat temporar pe server pentru procesare.


2. Vizualizare Statistici Plăți
   
Statistici: Afișează numărul total de persoane și categorii de plată:

   Plătit complet: Persoane care și-au achitat integral suma.

   Plată parțială: Persoane care au achitat o parte din sumă.

   Nu au plătit: Persoane care nu au făcut nicio plată.

Reprezentare vizuală: Statisticile sunt prezentate într-o diagramă circulară, unde fiecare categorie este reprezentată de o culoare distinctă, oferind o imagine rapidă a situației plăților.

Actualizare dinamică: Componenta de statistici se reîncarcă automat la fiecare încărcare de fișier CSV nou.


3. Generare remindere personalizate (simulare email)

Notificări personalizate: Generează mesaje de reamintire adaptate fiecărui utilizator, bazate pe starea plății (parțială sau deloc).

Detalii incluse: Mesajele conțin numele complet al utilizatorului, suma totală de plată și suma restantă.

Simulare email: În loc să trimită emailuri reale, aplicația creează fișiere text (.txt) în directorul 'reminders/' al serverului, simulând conținutul și destinația fiecărui email.


🛠️ Tehnologii Utilizate

Backend:

Python 3.x: Limbajul de programare principal.

Flask: Micro-framework web pentru crearea API-urilor.

Flask-CORS: Extensie pentru gestionarea politicilor Cross-Origin Resource Sharing.

Pandas: Librărie pentru manipularea și analiza datelor (utilizată pentru citirea și procesarea CSV-urilor).


Frontend:

React: Librărie JavaScript pentru construirea interfețelor utilizator.

TypeScript: Superset al JavaScript care adaugă tipuri statice.

CSS Modules: Pentru a asigura stiluri izolate și a evita conflictele CSS.

Fetch API: Pentru a comunica cu backend-ul.


💡 Utilizare

Încărcă un Fișier CSV:

Pe interfața aplicației, trage și plasează un fișier CSV în zona dedicată sau apasă "Selectează din calculator".

Formatul CSV așteptat: Fișierul tău CSV trebuie să conțină următoarele coloane (numele trebuie să se potrivească exact, inclusiv majuscule/minuscule și spații):

nume

prenume

varsta

suma platita

rest de plata

suma de plata

email


Exemplu de conținut CSV:

nume,prenume,varsta,suma platita,rest de plata,suma de plata,email
Popescu,Andrei,30,100,0,100,andrei.popescu@example.com
Ionescu,Maria,25,25,25,50,maria.ionescu@example.com
Vasilescu,Ionut,40,0,200,200,ionut.vasilescu@example.com
Dinu,Elena,35,75,0,75,elena.dinu@example.com


Vizualizează statisticile:

După încărcarea cu succes a fișierului CSV, componenta "Statistici Plăți" se va actualiza automat, afișând diagrama circulară cu proporțiile de plăți complete, parțiale și neplătite.


Trimite remindere:

Apasă butonul "Trimite Remindere Plăți".

Serverul va genera fișiere text personalizate în directorul 'backend/reminders/' pentru fiecare persoană care are o plată restantă (parțială sau deloc).


🚀 Îmbunătățiri Viitoare

Bază de date: Stocarea datelor în PostgreSQL, SQLite sau MongoDB pentru persistență și scalabilitate, în loc de fișiere CSV temporare.

Autentificare: Implementarea unui sistem de autentificare pentru utilizatori.

Trimitere emailuri reale: Integrarea cu un serviciu de trimitere emailuri (ex: SendGrid, Mailgun) pentru a trimite remindere reale.

Interfață avansată: Adăugarea de filtre, sortări și posibilitatea de a edita datele direct din interfață.

Raportare detaliată: Generarea de rapoarte PDF sau exporturi de date.

Notificări în timp real: Utilizarea WebSockets pentru a notifica frontend-ul imediat ce datele de pe server se schimbă.
