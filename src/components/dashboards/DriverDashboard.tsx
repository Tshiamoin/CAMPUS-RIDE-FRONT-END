import React, { useState } from 'react';
import { Bus, MOCK_STOPS } from '../../types';
import { Bus as BusIcon, MapPin, Users, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DriverDashboardProps {
  bus: Bus;
}

export default function DriverDashboard({ bus: initialBus }: DriverDashboardProps) {
  const [bus, setBus] = useState(initialBus);

  const toggleStatus = () => {
    setBus(prev => ({
      ...prev,
      status: prev.status === 'delayed' ? 'on-time' : 'delayed'
    }));
  };

  const nextStop = () => {
    const currentIndex = MOCK_STOPS.findIndex(s => s.name === bus.currentStop);
    const nextIndex = (currentIndex + 1) % MOCK_STOPS.length;
    const futureIndex = (currentIndex + 2) % MOCK_STOPS.length;
    
    setBus(prev => ({
      ...prev,
      currentStop: MOCK_STOPS[nextIndex].name,
      nextStop: MOCK_STOPS[futureIndex].name,
      coordinates: MOCK_STOPS[nextIndex].coordinates
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-slate-200 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 font-black text-2xl">
                {bus.routeNumber}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">{bus.routeName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${bus.status === 'on-time' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{bus.status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={toggleStatus}
              className={`p-4 rounded-2xl transition-all ${
                bus.status === 'delayed' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' 
                  : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'
              }`}
            >
              {bus.status === 'delayed' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} className="text-brand-accent" /> Active Location
              </p>
              <p className="text-xl font-black text-slate-800">{bus.currentStop}</p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={12} className="text-slate-400" /> Next Destination
              </p>
              <p className="text-xl font-black text-slate-800">{bus.nextStop}</p>
            </div>
          </div>

          <button 
            onClick={nextStop}
            className="w-full py-6 bg-brand-accent text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Arrive at Next Stop <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <Users size={32} />
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800">{bus.occupied}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Passengers</p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent" style={{ width: `${(bus.occupied/bus.capacity)*100}%` }} />
            </div>
            <p className="text-[10px] font-bold text-slate-400">Capacity: {bus.capacity} Seats</p>
          </div>

          <div className="bg-pink-600 rounded-[32px] p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Emergency</p>
              <p className="text-lg font-black leading-tight">SOS Help Line</p>
            </div>
            <button className="mt-4 w-full bg-white text-pink-600 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg">
              Broadcast Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
