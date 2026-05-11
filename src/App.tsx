/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BusMap from './components/BusMap';
import BusCard from './components/BusCard';
import BookingModal from './components/BookingModal';
import RoleSelector from './components/RoleSelector';
import DriverDashboard from './components/dashboards/DriverDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import MarshalDashboard from './components/dashboards/MarshalDashboard';
import LoginPage from './pages/LoginPage';
import { MOCK_BUSES, Bus, Booking, User, UserRole, BusRequest } from './types';
import { Search, Clock, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [busRequests, setBusRequests] = useState<BusRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication & User Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
          setIsAuthenticated(true);
        } else {
          // This should ideally be handled during login, but as a fallback:
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fleet Sync
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = collection(db, 'buses');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fleet = snapshot.docs.map(doc => doc.data() as Bus);
      if (fleet.length === 0) {
        // Seed initial data if empty (Admin only or just first person)
        MOCK_BUSES.forEach(bus => {
          setDoc(doc(db, 'buses', bus.id), bus);
        });
      } else {
        setBuses(fleet);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'buses'));
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Bookings Sync
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    let q;
    if (currentUser.role === 'admin') {
      q = collection(db, 'bookings');
    } else {
      q = query(collection(db, 'bookings'), where('userId', '==', currentUser.id));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(doc => doc.data() as Booking));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'bookings'));
    return () => unsubscribe();
  }, [isAuthenticated, currentUser]);

  // Requests Sync
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    if (currentUser.role !== 'admin' && currentUser.role !== 'marshal') return;

    const q = query(collection(db, 'busRequests'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBusRequests(snapshot.docs.map(doc => doc.data() as BusRequest));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'busRequests'));
    return () => unsubscribe();
  }, [isAuthenticated, currentUser]);

  const handleLoginSuccess = async (role: UserRole) => {
    // Role will be updated in Firestore during LoginPage's signInWithPopup
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleBook = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (bus) {
      setSelectedBus(bus);
      setIsBookingOpen(true);
    }
  };

  const onConfirmBooking = async (details: any) => {
    const bus = buses.find(b => b.id === details.busId);
    if (!bus || !currentUser) return;

    try {
      // 1. Update bus occupancy
      await updateDoc(doc(db, 'buses', bus.id), {
        occupied: Math.min(bus.occupied + 1, bus.capacity)
      });

      // 2. Create booking
      const bookingId = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'bookings', bookingId), {
        id: bookingId,
        busId: details.busId,
        route: bus.routeNumber,
        time: details.time,
        seatNumber: 'N/A',
        status: 'confirmed',
        userName: currentUser.name,
        userId: currentUser.id,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    try {
      // 1. Update bus occupancy
      const bus = buses.find(b => b.id === booking.busId);
      if (bus) {
        await updateDoc(doc(db, 'buses', bus.id), {
          occupied: Math.max(bus.occupied - 1, 0)
        });
      }

      // 2. Remove booking
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bookings');
    }
  };

  const handleBusRequest = async (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus || !currentUser) return;

    const requestId = Math.random().toString(36).substr(2, 7);
    try {
      await setDoc(doc(db, 'busRequests', requestId), {
        id: requestId,
        busId: bus.id,
        routeNumber: bus.routeNumber,
        marshalId: currentUser.id,
        marshalName: currentUser.name,
        timestamp: new Date().toLocaleTimeString(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'busRequests');
    }
  };

  const handleScanPassenger = async (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    try {
      await updateDoc(doc(db, 'buses', busId), {
        occupied: Math.min(bus.occupied + 1, bus.capacity)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `buses/${busId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-500/20" />
          <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Initializing Core System</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 md:pl-64 pb-24 md:pb-0 font-sans">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} role={currentUser.role} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 capitalize">
              {currentUser.role === 'student' ? (activeTab === 'home' ? 'Dashboard' : activeTab) : `${currentUser.role} Control`}
            </h1>
            <p className="text-slate-500 font-bold">Welcome back, {currentUser.name}</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pink-600 hover:border-pink-100 hover:bg-pink-50 transition-all shadow-sm"
            >
              Sign Out
            </button>
            
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-brand-accent flex items-center justify-center text-brand-accent font-black text-xs">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="hidden lg:inline text-sm font-bold text-slate-700">{currentUser.name}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentUser.role === 'student' ? (
            <StudentDashboard 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              bookings={bookings}
              handleBook={handleBook}
              buses={buses}
              onCancelBooking={handleCancelBooking}
            />
          ) : currentUser.role === 'driver' ? (
            activeTab === 'home' ? (
              <motion.div 
                key="driver-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <DriverDashboard bus={buses[0]} />
              </motion.div>
            ) : (
              <motion.div 
                key="driver-map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[calc(100vh-200px)] min-h-[500px]"
              >
                <BusMap onBusSelect={setSelectedBus} selectedBusId={selectedBus?.id} buses={buses} />
              </motion.div>
            )
          ) : currentUser.role === 'marshal' ? (
            activeTab === 'home' ? (
              <motion.div 
                key="marshal-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MarshalDashboard 
                  buses={buses} 
                  onBusRequest={handleBusRequest} 
                  onScanPassenger={handleScanPassenger}
                  activeRequests={busRequests}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="marshal-map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[calc(100vh-200px)] min-h-[500px]"
              >
                <BusMap onBusSelect={setSelectedBus} selectedBusId={selectedBus?.id} buses={buses} />
              </motion.div>
            )
          ) : (
            activeTab === 'home' ? (
              <motion.div 
                key="admin-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdminDashboard buses={buses} busRequests={busRequests} />
              </motion.div>
            ) : activeTab === 'map' ? (
              <motion.div 
                key="admin-map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[calc(100vh-200px)] min-h-[500px]"
              >
                <BusMap onBusSelect={setSelectedBus} selectedBusId={selectedBus?.id} buses={buses} />
              </motion.div>
            ) : (
              <motion.div 
                key="admin-schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdminDashboard buses={buses} bookings={bookings} busRequests={busRequests} view="logistics" />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <BookingModal 
        isOpen={isBookingOpen} 
        bus={selectedBus} 
        onClose={() => setIsBookingOpen(false)} 
        onConfirm={onConfirmBooking}
      />
    </div>
  );
}
