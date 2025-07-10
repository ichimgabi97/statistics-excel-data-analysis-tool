Aplicația de Analiză și Notificare Plăți
Această aplicație web simplă permite utilizatorilor să încarce fișiere CSV cu date de plată, să vizualizeze statistici relevante într-un mod intuitiv și să genereze remindere personalizate pentru utilizatorii cu plăți restante.

🚀 Funcționalități Principale
Aplicația este împărțită în două părți principale: un backend Python cu Flask și un frontend React cu TypeScript.

1. Încărcare Fișier CSV (cu Drag & Drop)
   Interfață Intuitivă: O zonă de încărcare modernă, cu suport pentru drag-and-drop sau selecție clasică din exploratorul de fișiere.

Validare: Asigură că doar fișierele cu extensia .csv sunt acceptate.

Stocare Temporară: Fișierul CSV este salvat temporar pe server pentru procesare.

2. Vizualizare Statistici Plăți (Diagramă Circulară Interactivă)
   Statistici Cheie: Afișează numărul total de persoane și categorii de plată:

Plătit Complet: Persoane care și-au achitat integral suma.

Plată Parțială: Persoane care au achitat o parte din sumă.

Nu au Plătit: Persoane care nu au făcut nicio plată.

Reprezentare Vizuală: Statisticile sunt prezentate într-o diagramă circulară elegantă, unde fiecare categorie este reprezentată de o culoare distinctă (verde, galben, roșu), oferind o imagine rapidă a situației plăților.

Actualizare Dinamică: Componenta de statistici se reîncarcă automat la fiecare încărcare de fișier CSV nou.

3. Generare Remindere Personalizate (Simulare Email)
   Notificări Personalizate: Generează mesaje de reamintire adaptate fiecărui utilizator, bazate pe starea plății (parțială sau deloc).

Detalii Incluse: Mesajele conțin numele complet al utilizatorului, suma totală de plată și suma restantă.

Simulare Email: În loc să trimită emailuri reale, aplicația creează fișiere text (.txt) în directorul reminders/ al serverului, simulând conținutul și destinația fiecărui email. Aceasta este utilă pentru testare și verificare.

🛠️ Tehnologii Utilizate
Backend:

Python 3.x: Limbajul de programare principal.

Flask: Micro-framework web pentru crearea API-urilor.

Flask-CORS: Extensie pentru gestionarea politicilor Cross-Origin Resource Sharing.

Pandas: Librărie puternică pentru manipularea și analiza datelor (utilizată pentru citirea și procesarea CSV-urilor).

Frontend:

React: Librărie JavaScript pentru construirea interfețelor utilizator.

TypeScript: Superset al JavaScript care adaugă tipuri statice, îmbunătățind robustețea codului.

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

Vizualizează Statisticile:

După încărcarea cu succes a fișierului CSV, componenta "Statistici Plăți" se va actualiza automat, afișând diagrama circulară cu proporțiile de plăți complete, parțiale și neplătite.

Trimite Remindere:

Apasă butonul "Trimite Remindere Plăți".

Serverul va genera fișiere text personalizate în directorul backend/reminders/ pentru fiecare persoană care are o plată restantă (parțială sau deloc).

🚀 Îmbunătățiri Viitoare (Idei)
Bază de Date: Stocarea datelor în PostgreSQL, SQLite sau MongoDB pentru persistență și scalabilitate, în loc de fișiere CSV temporare.

Autentificare: Implementarea unui sistem de autentificare pentru utilizatori.

Trimitere Emailuri Reale: Integrarea cu un serviciu de trimitere emailuri (ex: SendGrid, Mailgun) pentru a trimite remindere reale.

Interfață Avansată: Adăugarea de filtre, sortări și posibilitatea de a edita datele direct din interfață.

Raportare Detaliată: Generarea de rapoarte PDF sau exporturi de date.

Notificări în Timp Real: Utilizarea WebSockets pentru a notifica frontend-ul imediat ce datele de pe server se schimbă.
