import React from 'react';
import { Bus, MOCK_BUSES, Booking, BusRequest } from '../../types';
import { Activity, Users, Truck, MessageSquare, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import BusMap from '../BusMap';

interface AdminDashboardProps {
  buses?: Bus[];
  bookings?: Booking[];
  busRequests?: BusRequest[];
  view?: 'overview' | 'logistics';
}

export default function AdminDashboard({ 
  buses = MOCK_BUSES, 
  bookings = [], 
  busRequests = [],
  view = 'overview' 
}: AdminDashboardProps) {
  const stats = [
    { label: 'Active Buses', value: String(buses.length), icon: Truck, color: 'bg-indigo-50 text-brand-accent' },
    { label: 'Live Passengers', value: String(buses.reduce((acc, b) => acc + b.occupied, 0)), icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Marshal Requests', value: String(busRequests.length), icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
  ];

  if (view === 'logistics') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight text-white/0 bg-gradient-to-r from-slate-800 to-slate-400 bg-clip-text">Logistics Management</h2>
              <p className="text-slate-500 font-bold">Monitor all active spot requests across the fleet.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Requests</p>
                <p className="text-2xl font-black text-brand-accent">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  <th className="px-8 py-5">Passenger</th>
                  <th className="px-8 py-5">Route</th>
                  <th className="px-8 py-5">Request ID</th>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                             {booking.userName?.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-black text-slate-800 text-sm">{booking.userName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className="px-3 py-1 bg-indigo-50 text-brand-accent rounded-lg font-black text-xs border border-indigo-100">
                             {booking.route}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-black text-slate-400">{booking.id.toUpperCase()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">{booking.time}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <div className="space-y-3">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                            <Truck size={32} />
                         </div>
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active requests found</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Marshal Requests Section */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-800">Marshal Activity</h2>
              <p className="text-sm text-slate-500 font-bold">Live support requests and boarding logs.</p>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 text-amber-600 font-black text-xs uppercase tracking-widest">
              Live Feed
            </div>
          </div>

          <div className="space-y-4">
            {busRequests.length > 0 ? (
              busRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100 group hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 tracking-tight">Support Bus Requested</p>
                      <p className="text-xs text-slate-500 font-bold tracking-tight">Route {req.routeNumber} — {req.marshalName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono font-black text-slate-400 uppercase">{req.timestamp}</span>
                    <button className="px-5 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors">
                      Dispatch
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active marshal requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-800">Fleet Map</h2>
            <button className="text-sm font-black text-brand-accent bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">Satellite View</button>
          </div>
          <div className="h-[400px] border-4 border-white shadow-xl rounded-[40px] overflow-hidden">
             <BusMap buses={buses} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Fleet Status</h3>
              <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-accent transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bus.status === 'on-time' ? 'bg-emerald-500' : bus.status === 'delayed' ? 'bg-amber-500' : 'bg-pink-500'}`} />
                    <div>
                      <p className="text-xs font-black text-slate-800">Route {bus.routeNumber}</p>
                      <p className="text-[10px] font-bold text-slate-400">ID: {bus.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400">{bus.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
             <h3 className="text-lg font-black mb-4 flex items-center gap-2">
               <MessageSquare size={20} className="text-indigo-400" /> System Broadcast
             </h3>
             <textarea 
              placeholder="Type message to all users..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 ring-indigo-500/50 mb-4 h-24 placeholder:text-slate-500"
             />
             <button className="w-full py-3 bg-brand-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/50 hover:bg-brand-accent/90 transition-all">
               Send Alert
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
