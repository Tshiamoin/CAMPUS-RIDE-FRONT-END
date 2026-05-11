import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, Truck, ShieldCheck, Map as MapIcon, ArrowRight, ArrowLeft, Lock, User, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedPersona, setSelectedPersona] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const personas = [
    { 
      id: 'student' as UserRole, 
      label: 'Student', 
      icon: GraduationCap, 
      description: 'Track buses, book seats, and manage travel passes.',
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-100',
    },
    { 
      id: 'driver' as UserRole, 
      label: 'Bus Driver', 
      icon: Truck, 
      description: 'Update live status, manage route stops, and occupancy.',
      color: 'bg-emerald-500', 
      shadow: 'shadow-emerald-100',
    },
    { 
      id: 'marshal' as UserRole, 
      label: 'Campus Marshal', 
      icon: ShieldCheck, 
      description: 'Monitor crowd flow, request additional buses, and track boarding.',
      color: 'bg-amber-500', 
      shadow: 'shadow-amber-100',
    },
    { 
      id: 'admin' as UserRole, 
      label: 'Administrator', 
      icon: Lock, 
      description: 'Global fleet control, dispatch support, and view comprehensive logistics.',
      color: 'bg-slate-700', 
      shadow: 'shadow-slate-100',
    },
  ];

  const handleLogin = async (requestedRole: UserRole) => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user profile with selected role
        await setDoc(userDocRef, {
          id: user.uid,
          name: user.displayName || 'Anonymous User',
          role: requestedRole,
          email: user.email,
        });
      }

      onLogin(userDoc.exists() ? userDoc.data().role : requestedRole);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 map-bg">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid md:grid-cols-5 gap-0 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="md:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg">
                <MapIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Campus<span className="text-indigo-400">Ride</span></h1>
            </div>
            <h2 className="text-4xl font-black leading-tight mb-4 lowercase tracking-tight">Smart Campus Transport System</h2>
            <p className="text-slate-400 font-medium">Efficient, reliable, and connected transportation for our entire campus community.</p>
          </div>
          <div className="relative z-10 pt-10 border-t border-white/10">
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Infrastructure</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-sm font-bold">Node-01 Active & Secure</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 p-10 md:p-14 flex flex-col justify-center min-h-[500px]">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Welcome Back</h3>
            <p className="text-slate-500 font-medium tracking-tight">Select your role to access your personalized portal.</p>
          </div>

          <div className="space-y-4">
            {personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <button
                  key={persona.id}
                  disabled={loading}
                  onClick={() => handleLogin(persona.id)}
                  className="w-full flex items-center gap-5 p-5 bg-slate-50 hover:bg-white rounded-3xl border-2 border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all group text-left disabled:opacity-50"
                >
                  <div className={`${persona.color} p-4 rounded-2xl text-white shadow-lg ${persona.shadow} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{persona.label}</p>
                    <p className="text-sm text-slate-500 font-medium leading-tight">{persona.description}</p>
                  </div>
                  <div className="p-2 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                    {loading ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            University of Campus Ride — Secure Gateway
          </p>
        </div>
      </motion.div>
    </div>
  );
}
