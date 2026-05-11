
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { Bus as BusType } from '../types';

interface BookingModalProps {
  bus: BusType | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: any) => void;
}

export default function BookingModal({ bus, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState<'request' | 'confirm'>('request');

  if (!bus) return null;

  const handleConfirm = () => {
    onConfirm({
      busId: bus.id,
      time: new Date().toLocaleTimeString(),
    });
    setStep('confirm');
  };

  const handleClose = () => {
    setStep('request');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Request Spot</h2>
                  <p className="text-sm text-slate-500 font-bold">{bus.routeName}</p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              {step === 'request' ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      You are requesting a spot on the <span className="font-black text-slate-800">{bus.routeNumber}</span> bus. Spots are allocated as you board.
                    </p>
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Spots</span>
                        <span className="text-lg font-black text-emerald-600 tracking-tight">{bus.capacity - bus.occupied}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={bus.occupied >= bus.capacity}
                    className="w-full py-4 bg-brand-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale active:scale-95"
                  >
                    {bus.occupied >= bus.capacity ? 'Bus Full' : 'Confirm Spot Request'}
                  </button>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-100"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Confirmed!</h3>
                    <p className="text-sm text-slate-500 font-bold">Your travel request is active. Show your digital pass when boarding.</p>
                  </div>
                  
                  <div className="w-full bg-indigo-600 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Digital Boarding Pass</p>
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black opacity-60 uppercase">Bus Route</span>
                        <span className="font-black text-sm">{bus.routeNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black opacity-60 uppercase">Status</span>
                        <span className="font-black text-sm">Priority Boarding</span>
                      </div>
                      <div className="pt-3 border-t border-white/20">
                        <p className="text-[10px] font-black opacity-40 mb-1 uppercase tracking-widest">Digital Token</p>
                        <p className="font-mono text-lg font-bold uppercase">{Math.random().toString(36).substr(2, 6)}-RID</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
