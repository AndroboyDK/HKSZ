Parking Share App – React Native / Expo MVP

Dette projekt er et Minimum Viable Product (MVP) for en app, der gør det muligt at dele og leje parkeringspladser. Appen er udviklet i React Native ved hjælp af Expo og Firebase.

Formålet med projektet er at vise, hvordan man kan opbygge en simpel men fuldt funktionel applikation, hvor brugere kan have to roller: kunden, der leder efter og lejer parkeringspladser, og udlejeren (provider), der tilbyder sine parkeringspladser til leje. Projektet indeholder login- og registreringsfunktion med Firebase Authentication, realtime data med Firestore, CRUD-funktionalitet for parkeringspladser, og navigation mellem forskellige skærme ved hjælp af React Navigation.

For at køre projektet skal du have installeret Node.js (version 18 eller nyere), npm eller yarn, Expo CLI samt Watchman (hvis du bruger macOS). Du skal også have Xcode (for iOS simulator) eller Android Studio (for Android emulator).

Sådan kommer du i gang

Klon projektet fra GitHub med kommandoen:
git clone https://github.com/AndroboyDK/HKSZ/
Gå derefter ind i mappen med:
cd parking-share-app

Installer alle afhængigheder:
npm install

Opret et Firebase-projekt på https://console.firebase.google.com
 og aktiver Authentication (Email/Password) samt Cloud Firestore.

Opret filen src/lib/firebase.js og indsæt din Firebase konfiguration. Et eksempel ser sådan ud:

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'DIN_API_KEY',
  authDomain: 'DIT_DOMAIN',
  projectId: 'DIT_PROJECT_ID',
  storageBucket: 'DIT_BUCKET',
  messagingSenderId: 'DIN_SENDER_ID',
  appId: 'DIT_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


Start projektet med kommandoen:
npx expo start
Herefter kan du trykke i for iOS simulator, a for Android emulator eller scanne QR-koden i Expo Go appen på din telefon.

Projektstruktur

Projektet er opdelt i følgende mapper:

src/components: fælles komponenter

src/context: globale React Contexts (Auth og Role)

src/navigation: navigationsopsætning

src/screens: skærme opdelt i customer og provider

src/utils: validering og hjælpefunktioner

src/styles: global styling i én samlet styles.js

src/lib: Firebase opsætning



Alle tekster i appen vil være på dansk til sidst, og knapper samt labels skal holdes korte og klare.

Sådan tester du appen på en fysisk enhed

Installer Expo Go fra App Store eller Google Play. Start derefter appen med npx expo start, og scan QR-koden, der vises i terminalen.

Fejlfinding

Hvis du oplever problemer med afhængigheder eller Expo, kan du slette mappen node_modules og køre npm install igen. Du kan også rydde cachen med npx expo start -c. Hvis du stadig har problemer, kan du kontakte Zedan, som står for integration og overblik.

Projektets funktionalitet

Appen indeholder to hovedroller. Som kunde kan man oprette en profil, se sine tidligere lejeaftaler og finde parkeringspladser på et kort. Som udlejer kan man oprette og administrere parkeringspladser, modtage og håndtere forespørgsler samt se sine nuværende og tidligere udlejninger.

Der arbejdes løbende i sprints, hvor nye funktioner tilføjes. Projektet bruger Firebase Firestore til realtime data og Authentication til brugerstyring.

Kørsel af demo

Når appen er startet i Expo, kan du oprette en bruger via login-skærmen og derefter navigere mellem de forskellige faner. Alle data gemmes i Firestore, så du kan se ændringer i realtid mellem kunde- og udlejervisning.

Samlet set er vi langt med vores app - det næste bliver at gøre den mere brugervenlig som det vil fremgå i nogle af vores opgaver. 