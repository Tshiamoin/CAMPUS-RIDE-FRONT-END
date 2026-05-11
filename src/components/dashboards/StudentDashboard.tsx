import React from 'react';
import { Bus, Booking, MOCK_BUSES } from '../../types';
import { Search, Clock, ChevronRight, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import BusMap from '../BusMap';
import BusCard from '../BusCard';

interface StudentDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus | null) => void;
  bookings: Booking[];
  handleBook: (busId: string) => void;
  buses: Bus[];
  onCancelBooking: (id: string) => void;
}

export default function StudentDashboard({
  activeTab,
  setActiveTab,
  selectedBus,
  setSelectedBus,
  bookings,
  handleBook,
  buses,
  onCancelBooking
}: StudentDashboardProps) {
  if (activeTab === 'map') {
    return (
      <motion.div 
        key="student-map"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="h-[calc(100vh-200px)] min-h-[500px]"
      >
        <BusMap onBusSelect={setSelectedBus} selectedBusId={selectedBus?.id} buses={buses} />
      </motion.div>
    );
  }

  if (activeTab === 'schedule') {
    return (
      <motion.div 
        key="student-schedule"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200"
      >
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bus Schedule</h2>
          <div className="flex gap-2">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Filter routes..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 ring-brand-accent/20" />
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Route</th>
                <th className="px-8 py-5">Frequency</th>
                <th className="px-8 py-5">Next Stop</th>
                <th className="px-8 py-5">Live Status</th>
                <th className="px-8 py-5">Capacity</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-brand-accent shadow-sm">
                        {bus.routeNumber}
                      </div>
                      <span className="font-black text-slate-800">{bus.routeName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800 text-sm">Every 15m</p>
                    <p className="text-xs text-slate-400">First: 06:30 AM</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600">{bus.nextStop}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                       bus.status === 'on-time' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                       bus.status === 'delayed' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-pink-50 text-pink-600 border border-pink-100'
                     }`}>
                       {bus.status.replace('-', ' ')}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div className="h-full bg-brand-accent" style={{ width: `${(bus.occupied/bus.capacity)*100}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400">{bus.capacity - bus.occupied} FREE</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <button 
                      onClick={() => handleBook(bus.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:bg-white hover:text-brand-accent hover:shadow-md hover:border-slate-200 border-2 border-transparent rounded-xl transition-all"
                     >
                       <ChevronRight size={20} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  if (activeTab === 'booking') {
    return (
      <motion.div 
        key="student-booking"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-200 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-accent">
            <Bookmark size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2">My Spot Requests</h2>
          <p className="text-slate-500 mb-8">View your active travel requests across the campus network.</p>
          
          {bookings.length > 0 ? (
            <div className="grid gap-4 text-left">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] flex items-center justify-between">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-xl text-brand-accent shadow-sm">
                        {booking.route}
                      </div>
                      <div>
                         <p className="font-black text-slate-800">Confirmed Request</p>
                         <p className="text-sm font-bold text-slate-500 tracking-tight">Boarding at {booking.time}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                     <button className="px-4 py-2 bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-colors">View Pass</button>
                     <button 
                      onClick={() => onCancelBooking(booking.id)}
                      className="px-4 py-2 bg-white border border-slate-200 text-pink-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pink-50 transition-colors"
                     >
                       Cancel
                    </button>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl">
               <p className="text-slate-400 font-bold tracking-tight">No active requests found</p>
               <button 
                onClick={() => setActiveTab('home')}
                className="mt-4 text-brand-accent font-black text-sm hover:underline"
               >
                 Request your first spot
               </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="student-home"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-8">
        {/* Map Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               Live Tracking
            </h2>
            <button 
              onClick={() => setActiveTab('map')}
              className="text-sm font-black text-brand-accent hover:underline px-4 py-1 bg-white rounded-full shadow-sm border border-slate-200"
            >
              View Full Map
            </button>
          </div>
          <div className="h-[440px] border-4 border-white shadow-xl rounded-[40px] overflow-hidden">
            <BusMap onBusSelect={setSelectedBus} selectedBusId={selectedBus?.id} buses={buses} />
          </div>
        </section>

        {/* Recommendations */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock size={20} className="text-brand-accent" /> Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {buses.slice(0, 2).map((bus) => (
              <BusCard key={bus.id} bus={bus} onBook={handleBook} />
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-8">
        {/* My Bookings Sidebar */}
        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-black text-slate-800 mb-6">Recent Status</h2>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 group cursor-pointer hover:border-brand-accent transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center font-black text-white shadow-md shadow-indigo-200">
                      {booking.route}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">Priority Board</p>
                      <p className="text-[10px] uppercase font-bold text-brand-accent tracking-wider">{booking.time}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-brand-accent" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Bookmark size={24} />
              </div>
              <p className="text-sm text-slate-400 font-bold tracking-tight">No active requests</p>
            </div>
          )}
          <button 
            onClick={() => setActiveTab('booking')}
            className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-black text-slate-400 hover:border-brand-accent hover:text-brand-accent transition-all bg-slate-50 hover:bg-white"
          >
            View All Activity
          </button>
        </section>

        {/* Notifications */}
        <section className="bg-pink-50 rounded-[32px] p-8 shadow-sm border border-pink-100 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-lg font-black text-pink-600 uppercase tracking-widest">Alert!</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-pink-700 leading-snug">
              West Gate construction may delay Blue Line buses by 10-15 mins. Plan accordingly!
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
