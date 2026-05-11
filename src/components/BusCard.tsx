
import React from 'react';
import { Bus as BusType } from '../types';
import { Bus, Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface BusCardProps {
  key?: string;
  bus: BusType;
  onBook?: (busId: string) => void;
  className?: string;
}

export default function BusCard({ bus, onBook, className = '' }: BusCardProps) {
  const statusConfig = {
    'on-time': { label: 'On Time', color: 'text-status-success bg-status-success/10' },
    'delayed': { label: 'Delayed', color: 'text-status-warning bg-status-warning/10' },
    'full': { label: 'At Capacity', color: 'text-status-error bg-status-error/10' },
  };

  const config = statusConfig[bus.status];
  const occupancyRate = (bus.occupied / bus.capacity) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-[32px] p-7 shadow-sm border border-slate-200 flex flex-col gap-6 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 font-black text-xl">
            {bus.routeNumber}
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight">{bus.routeName}</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Route Service</span>
          </div>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${config.color}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-brand-accent" /> Arrival
          </span>
          <p className="font-black text-2xl text-slate-800">{bus.estimatedArrival} <span className="text-xs font-bold text-slate-400">mins</span></p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1.5 mb-1">
            <Users size={12} className="text-emerald-500" /> Availability
          </span>
          <p className="font-black text-2xl text-slate-800">{bus.capacity - bus.occupied} <span className="text-xs font-bold text-slate-400">free</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-bold tracking-tight">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            <span className="text-slate-800">{bus.currentStop}</span>
          </div>
          <ArrowRight size={16} className="text-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-slate-400">{bus.nextStop}</span>
          </div>
        </div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${occupancyRate}%` }}
            className={`h-full ${occupancyRate > 90 ? 'bg-status-error' : occupancyRate > 70 ? 'bg-status-warning' : 'bg-brand-accent shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`} 
          />
        </div>
      </div>

      <button 
        disabled={bus.status === 'full'}
        onClick={() => onBook?.(bus.id)}
        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
          bus.status === 'full' 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-brand-accent text-white hover:bg-indigo-700 shadow-indigo-100'
        }`}
      >
        <ShieldCheck size={20} />
        Request Spot
      </button>
    </motion.div>
  );
}
