// Oprettet af K
// Opgave: Implementer MapPicker-komponenten, som bruges i AddSpot og EditSpot til at vælge adresse på kortet.
// Du skal bruge expo-location til at hente koordinater og geocodeAsync/reverseGeocodeAsync til at finde adresser.
// TODO:
// 1. Installer expo-location i projektet (npx expo install expo-location).
// 2. Tilføj permissions til app.json under ios.infoPlist: "NSLocationWhenInUseUsageDescription": "Vi bruger din placering til at vælge parkeringsplads."
// 3. Opret et MapView med et Marker (brug react-native-maps som allerede er installeret).
// 4. Marker skal kunne trækkes (draggable=true). Når man slipper den, skal reverseGeocodeAsync bruges til at finde adresse.
// 5. Tilføj et tekstinput og en knap "Søg adresse" der bruger geocodeAsync til at flytte kortet til den adresse.
// 6. Tilføj en knap "Brug min nuværende placering" der centrerer kortet på brugerens nuværende koordinater.
// 7. Returnér valgte {lat, lng, address} gennem en prop kaldet onChange.
// 8. Test i AddSpotScreen at værdierne bliver gemt korrekt i Firestore.

