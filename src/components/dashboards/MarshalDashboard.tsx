import React, { useState } from 'react';
import { Bus, BusRequest } from '../../types';
import { ShieldCheck, Truck, Users, Scan, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarshalDashboardProps {
  buses: Bus[];
  onBusRequest: (busId: string) => void;
  onScanPassenger: (busId: string) => void;
  activeRequests: BusRequest[];
}

export default function MarshalDashboard({ 
  buses, 
  onBusRequest, 
  onScanPassenger,
  activeRequests 
}: MarshalDashboardProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = () => {
    if (!selectedBusId) return;
    setIsScanning(true);
    // Simulate scan
    setTimeout(() => {
      setIsScanning(false);
      onScanPassenger(selectedBusId);
      setScanSuccess(true);
      setTimeout(() => setScanSuccess(false), 3000);
    }, 2000);
  };

  const selectedBus = buses.find(b => b.id === selectedBusId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Station</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">Main Terminal</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 text-brand-accent rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Boarding Managed</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">{buses.reduce((acc, b) => acc + b.occupied, 0)} Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Requests</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">{activeRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bus Monitoring & Requests */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <Truck size={24} className="text-brand-accent" /> Live Fleet Status
          </h2>
          <div className="space-y-4">
            {buses.map((bus) => (
              <div 
                key={bus.id} 
                onClick={() => setSelectedBusId(bus.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  selectedBusId === bus.id 
                    ? 'border-brand-accent bg-indigo-50/30' 
                    : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-white text-slate-800 rounded-lg font-black text-xs shadow-sm border border-slate-100 uppercase tracking-widest">
                        {bus.routeNumber}
                      </span>
                      <span className="font-black text-slate-800 text-sm">{bus.routeName}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                      <Navigation size={12} className="text-brand-accent" /> {bus.currentStop}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      bus.status === 'full' ? 'text-pink-500' : 'text-emerald-500'
                    }`}>
                      {bus.status}
                    </p>
                    <p className="text-xs font-black text-slate-800">{bus.occupied}/{bus.capacity} CAP</p>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      bus.occupied / bus.capacity > 0.9 ? 'bg-pink-500' : 'bg-brand-accent'
                    }`}
                    style={{ width: `${(bus.occupied / bus.capacity) * 100}%` }}
                  />
                </div>

                {bus.status === 'full' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBusRequest(bus.id);
                    }}
                    disabled={activeRequests.some(r => r.busId === bus.id && r.status === 'pending')}
                    className="w-full py-3 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <AlertTriangle size={16} /> 
                    {activeRequests.some(r => r.busId === bus.id && r.status === 'pending') 
                      ? 'Request Sent' 
                      : 'Request Support Bus'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Boarding Management */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <Scan size={24} className="text-brand-accent" /> Scan to Board
          </h2>
          
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 text-center space-y-6">
            {!selectedBusId ? (
              <div className="py-12">
                 <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Truck size={40} />
                 </div>
                 <p className="text-slate-400 font-bold">Select a bus from the left to start tracking passengers.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Boarding</p>
                  <p className="text-xl font-black text-slate-800">{selectedBus?.routeName}</p>
                  <p className="text-xs font-bold text-slate-500">Currently {selectedBus?.occupied} passengers onboard</p>
                </div>

                <div className="relative mx-auto w-48 h-48 bg-white rounded-3xl border-4 border-slate-100 flex items-center justify-center overflow-hidden">
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute h-1 w-full bg-brand-accent shadow-[0_0_15px_rgba(79,70,229,0.8)] z-10"
                      />
                    )}
                    {scanSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center z-20 backdrop-blur-sm"
                      >
                         <div className="bg-white p-4 rounded-full shadow-xl">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Scan size={64} className="text-slate-200" />
                </div>

                <button
                  onClick={handleScan}
                  disabled={isScanning || (selectedBus && selectedBus.occupied >= selectedBus.capacity)}
                  className="w-full py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isScanning ? 'Processing...' : selectedBus && selectedBus.occupied >= selectedBus.capacity ? 'Bus Full' : 'Scan Pass' }
                </button>
                
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Simulate scanning a student's QR code to record boarding.
                </p>
              </>
            )}
          </div>

          {/* Recent History */}
          <div className="mt-8">
            <h3 className="text-lg font-black text-slate-800 mb-4 tracking-tight">Recent Boarding</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center font-black text-slate-400 text-[10px]">
                      P{i}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">Boarding Recorded</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{10 - i} min ago</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full">
                    <CheckCircle2 size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> section
      </div>
    </div>
  );
}
