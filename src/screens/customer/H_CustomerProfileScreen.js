// Oprettet af H
// Opgave: Lav en skærm hvor kunden kan redigere sine personlige oplysninger (navn, telefonnummer, bilens registreringsnummer).
// TODO:
// 1. Opret en Firestore collection 'users' hvor hver bruger har et dokument med id = auth.currentUser.uid.
// 2. Hent eksisterende brugerdata ved komponentstart og vis det i tekstfelter.
// 3. Hvis brugeren ikke findes i databasen, skal der oprettes et dokument med tomme felter.
// 4. Felter: displayName, phone, vehicleReg (bilens nummerplade).
// 5. Tilføj en knap "Gem oplysninger" der opdaterer dokumentet i Firestore.
// 6. Tilføj simpel validering (felter må ikke være tomme).
// 7. Giv feedback med en alert når data er gemt.

