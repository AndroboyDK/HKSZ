// src/data/seed.js
import { db } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function seedRequestsForProvider({ providerUid }) {
  const items = [
    {
      customer: 'Mads H.',
      time: 'Today 14:00-16:00',
      spot: 'Nørrebro Backyard',
      price: 120,
      vehicle: 'AB12 345',
      notes: 'Needs gate code',
    },
    {
      customer: 'Sara L.',
      time: 'Tomorrow 09:00-12:00',
      spot: 'Østerbro Private Spot',
      price: 180,
      vehicle: 'CD34 567',
      notes: 'EV, prefers covered spot',
    },
  ];

  const promises = items.map((it) =>
    addDoc(collection(db, 'requests'), {
      ...it,
      providerUid,
      customerUid: providerUid,   // replace later with real customer uids
      status: 'pending',
      createdAt: serverTimestamp(),
    })
  );

  await Promise.all(promises);
}
export async function seedSpotsForProvider({ providerUid }) {
  const items = [
    {
      title: 'Østerbro Private Spot',
      address: 'Østerbrogade 123, 2100 København Ø',
      lat: 55.705,
      lng: 12.572,
      pricePerHour: 20,
    },
    {
      title: 'Vesterbro Gated Parking',
      address: 'Istedgade 45, 1650 København V',
      lat: 55.669,
      lng: 12.555,
      pricePerHour: 25,
    },
  ];

  const promises = items.map((it) =>
    addDoc(collection(db, 'spots'), {
      ...it,
      providerUid,
      isAvailable: true,
      createdAt: serverTimestamp(),
    })
  );

  await Promise.all(promises);
}