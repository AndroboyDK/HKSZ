// Oprettet af S
// Opgave: Lav en opsummeringsskærm der viser valgt parkeringsplads, tid og samlet pris før booking bekræftes.
// TODO:
// 1. Modtag data fra RequestTimeScreen via route.params (spot, timeStart, timeEnd, quotedPrice).
// 2. Vis et kort resume med spot.title, adresse, starttid, sluttid og pris.
// 3. Tilføj en knap "Bekræft booking".
// 4. Når der trykkes på knappen, skal du oprette et nyt dokument i 'requests' i Firestore med felterne:
//    - spotId, providerUid, customerUid, timeStart, timeEnd, quotedPrice, status='pending', createdAt=serverTimestamp().
// 5. Naviger tilbage til kundens hovedskærm med en alert "Booking sendt til udlejer".

