
import React from 'react';
import { Home, Map as MapIcon, Calendar, Bookmark, Bell, Settings, Truck, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
}

export default function Navigation({ activeTab, setActiveTab, role }: NavigationProps) {
  const studentTabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: MapIcon, label: 'Live' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'booking', icon: Bookmark, label: 'Bookings' },
  ];

  const driverTabs = [
    { id: 'home', icon: Truck, label: 'Command' },
    { id: 'map', icon: MapIcon, label: 'Fleet' },
  ];

  const adminTabs = [
    { id: 'home', icon: Activity, label: 'Overview' },
    { id: 'map', icon: MapIcon, label: 'Fleet Map' },
    { id: 'schedule', icon: Calendar, label: 'Logistics' },
  ];

  const marshalTabs = [
    { id: 'home', icon: ShieldCheck, label: 'Control' },
    { id: 'map', icon: MapIcon, label: 'Live Map' },
  ];

  const tabs = role === 'admin' ? adminTabs : role === 'driver' ? driverTabs : role === 'marshal' ? marshalTabs : studentTabs;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-brand-accent p-2 rounded-2xl shadow-lg shadow-indigo-100">
              <MapIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Campus<span className="text-brand-accent">Ride</span></h1>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50 border-2 border-indigo-200 text-brand-accent shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-2 border-transparent'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-brand-accent' : 'text-slate-400'} />
                  <span className="font-bold tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-1 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-colors">
            <Bell size={20} />
            <span className="font-bold tracking-tight">System Alerts</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-colors">
            <Settings size={20} />
            <span className="font-bold tracking-tight">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-50 overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-4 w-12 h-1 bg-brand-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon 
                size={24} 
                className={`transition-colors ${isActive ? 'text-brand-accent' : 'text-gray-400 group-hover:text-gray-600'}`} 
              />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-brand-accent' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
