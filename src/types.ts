
export type UserRole = 'student' | 'driver' | 'admin' | 'marshal';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  assignedBusId?: string; // For drivers
}

export interface BusRequest {
  id: string;
  busId: string;
  routeNumber: string;
  marshalId: string;
  marshalName: string;
  timestamp: string;
  status: 'pending' | 'dispatched' | 'ignored';
}

export interface Bus {
  id: string;
  routeNumber: string;
  routeName: string;
  currentStop: string;
  nextStop: string;
  status: 'on-time' | 'delayed' | 'full';
  estimatedArrival: number; // minutes
  capacity: number;
  occupied: number;
  coordinates: { lat: number; lng: number };
  driverId?: string;
}

export interface Booking {
  id: string;
  busId: string;
  route: string;
  time: string;
  seatNumber: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  userName?: string;
  userId?: string;
}

export interface Stop {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
}

export const MOCK_STOPS: Stop[] = [
  { id: '1', name: 'South Campus', coordinates: { lat: -25.5568, lng: 28.1129 } },
  { id: '2', name: 'North Campus', coordinates: { lat: -25.5410, lng: 28.0930 } },
  { id: '3', name: 'Arcadia Campus', coordinates: { lat: -25.7475, lng: 28.2010 } },
];

export const MOCK_BUSES: Bus[] = [
  {
    id: 'B101',
    routeNumber: 'TUT-01',
    routeName: 'Soshanguve Link',
    currentStop: 'South Campus',
    nextStop: 'North Campus',
    status: 'on-time',
    estimatedArrival: 5,
    capacity: 65,
    occupied: 22,
    coordinates: { lat: -25.5500, lng: 28.1050 }
  },
  {
    id: 'B102',
    routeNumber: 'TUT-02',
    routeName: 'Pretoria Express',
    currentStop: 'Arcadia Campus',
    nextStop: 'South Campus',
    status: 'delayed',
    estimatedArrival: 15,
    capacity: 65,
    occupied: 60,
    coordinates: { lat: -25.6500, lng: 28.1500 }
  },
  {
    id: 'B103',
    routeNumber: 'TUT-03',
    routeName: 'Inter-Campus',
    currentStop: 'North Campus',
    nextStop: 'Arcadia Campus',
    status: 'full',
    estimatedArrival: 2,
    capacity: 65,
    occupied: 65,
    coordinates: { lat: -25.5415, lng: 28.0935 }
  }
];
