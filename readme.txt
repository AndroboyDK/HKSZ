Goddag

Først installere depnedencies: 

npm install 


eller 


npm install @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack expo expo-status-bar react react-native react-native-screens react-native-safe-area-context react-native-maps @expo/vector-icons

Dernæst kør appen.. 
npx expo start --tunnel


Sees




SPRINTS: 
✅ Completed Sprints
Sprint A — Authentication

Integrated Firebase Authentication (email/password).

Added AuthContext to manage login state.

Users can sign up, log in, log out.

Status: ✔️ Done.

Sprint B — Requests (live updates)

Connected Requests list (Provider) to Firestore with real-time updates.

Created RequestDetails screen with Accept/Decline actions.

Accept/Decline updates Firestore instantly.

Status: ✔️ Done.

Sprint C — Rentals (basic)

On Accept, automatically creates a rental in Firestore.

Previous Rentals screens (Customer & Provider) now fetch data from Firestore.

Status: ✔️ Done.

Sprint D — Spots + Find Parking + Request Flow

Created spots collection in Firestore.

Providers can seed demo spots.

Customers see available spots on a map (Find Parking).

New SpotDetails screen → customers can “Request booking”.

Request goes to provider’s Requests → normal Accept flow.

Status: ✔️ Done.

Sprint E — Rental Lifecycle + Current Rentals

Rentals now have statuses: active, completed.

Accepting a request → sets timeStart, locks the spot (isAvailable = false).

Provider can complete a rental → sets timeEnd, unlocks spot.

New Provider Current Rentals screen.

Optional Customer Active Rental screen.

Previous Rentals now show only completed.

Status: ✔️ Done.

Sprint F — Provider Spot Management (CRUD)

New My Spots screen for providers.

Add Spot and Edit Spot forms with validation.

Providers can toggle availability, edit details, and delete spots.

Deletion blocked if the spot has an active rental.

Customers now see provider-created spots, not seeded ones.

Status: ✔️ Done.

🚀 Upcoming Sprints
Sprint G — User Profiles

Add users/{uid} documents (name, phone, vehicle info, payout info).

Build Profile screens to view/update this info.

Data persists across logins.

Goal: Let customers store vehicle/payment details, providers store payout info.

Sprint H — Security Rules Hardening

Firestore rules:

Only providers can mutate their spots.

Only involved users can view/edit requests & rentals.

Move from “dev mode” to production-ready rules.

Goal: Protect data integrity before broader testing.

Sprint I — Request Flow Enhancements

Add time picker (start/end) when requesting a spot.

Compute total price (hours × pricePerHour).

Prevent requests on already active rentals.

Goal: Make booking flow realistic.

Sprint J — Rental Lifecycle Polish

Auto-complete rentals when end time passes (later via Cloud Functions).

Add cancel flow.

Split Active vs Previous rentals into dedicated tabs.

Goal: Rentals reflect real-world lifecycle smoothly.

Sprint K — Notifications

Push notifications via Expo:

Provider notified on new request.

Customer notified on accept/decline/completion.

Store device tokens per user.

Goal: Real-time engagement.

Sprint L — Geo & Search UX

Allow filtering/sorting in Find Parking (price, distance, EV charger, covered).

Add bounding-box queries around map region.

Goal: Smarter discovery for customers.

Sprint M — Payments

Start with mock “payment successful” screen.

Integrate Stripe test mode for real payments.

Record payment status in rentals.

Goal: Monetize booking flow.

Sprint N — Cloud Functions

Server-side enforcement:

Atomic accept → rental creation + spot lock.

Rental complete → unlock spot, notify.

Goal: Integrity & automation.

Sprint O — Reliability & Performance

Pagination for lists.

Loading states & error handling.

Firestore offline persistence.

Goal: Scale & resilience.

Sprint P — Polish & Launch Readiness

App theming, icons, splash screen.

Build via EAS for TestFlight/Play Store.

Add basic analytics.

Goal: Shareable MVP build.

Sprint Q — QA & Automation

Lightweight tests (unit + integration).

Crash reporting (Sentry/Crashlytics).

Goal: Stability in test/production.