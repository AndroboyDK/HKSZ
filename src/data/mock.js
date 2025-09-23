export const mockParkings = [
{
id: 'p1',
title: 'Østerbro Private Spot',
pricePerHour: 20,
coords: { latitude: 55.705, longitude: 12.572 },
address: 'Østerbrogade 123, 2100 København Ø',
},
{
id: 'p2',
title: 'Vesterbro Gated Parking',
pricePerHour: 25,
coords: { latitude: 55.669, longitude: 12.555 },
address: 'Istedgade 45, 1650 København V',
},
{
id: 'p3',
title: 'Nørrebro Backyard',
pricePerHour: 18,
coords: { latitude: 55.699, longitude: 12.544 },
address: 'Nørrebrogade 200, 2200 København N',
},
];


export const mockRentals = [
{
id: 'r1',
place: 'Østerbro Private Spot',
date: '2025-09-01',
durationHours: 2,
totalPrice: 40,
},
{
id: 'r2',
place: 'Vesterbro Gated Parking',
date: '2025-08-22',
durationHours: 3,
totalPrice: 75,
},
];


export const mockRequests = [
{ id: 'rq1', customer: 'Mads H.', time: 'Today 14:00-16:00', spot: 'Nørrebro Backyard', price: 120, vehicle: 'AB12 345', notes: 'Needs gate code' },
{ id: 'rq2', customer: 'Sara L.', time: 'Tomorrow 09:00-12:00', spot: 'Østerbro Private Spot', price: 180, vehicle: 'CD34 567', notes: 'EV, prefers covered spot' },
];