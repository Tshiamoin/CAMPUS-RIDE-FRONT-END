
import React, { useState } from 'react';
import { Bus as BusType, Stop as StopType, MOCK_BUSES, MOCK_STOPS } from '../types';
import { Bus, MapPin, Navigation, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

interface BusMapProps {
  onBusSelect?: (bus: BusType) => void;
  selectedBusId?: string | null;
  buses?: BusType[];
}

const API_KEY = 
  process.env.GOOGLE_MAPS_PLATFORM_KEY || 
  'AIzaSyC3ytcUsyXEd9xf1cQHUV-T7ldgEotGC6c';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function BusMarker({ bus, isSelected, onSelect }: { bus: BusType, isSelected: boolean, onSelect: () => void, key?: string }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);

  const statusColors = 
    bus.status === 'on-time' ? { bg: '#10b981', glyph: '#fff' } :
    bus.status === 'delayed' ? { bg: '#f59e0b', glyph: '#fff' } : 
    { bg: '#ec4899', glyph: '#fff' };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={bus.coordinates}
        onClick={() => {
          onSelect();
          setShowInfo(!showInfo);
        }}
        title={bus.routeNumber}
      >
        <div className="relative group">
           {/* Custom Marker Content for more flair */}
           <div className={`p-2 rounded-xl border-2 border-white shadow-xl transition-all ${isSelected ? 'scale-110 ring-4 ring-indigo-500/50' : 'scale-100'}`} style={{ backgroundColor: statusColors.bg }}>
              <Bus size={18} className="text-white" />
           </div>
           
           {/* Mini Badge */}
           <div className="absolute -top-2 -right-2 bg-white text-slate-800 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-slate-100">
             {bus.routeNumber}
           </div>
        </div>
      </AdvancedMarker>
      
      {showInfo && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setShowInfo(false)}
          headerDisabled
        >
          <div className="p-2 min-w-[150px]">
             <div className="flex items-center gap-2 mb-2">
                <span className="font-black text-slate-800">{bus.routeNumber}</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-500">{bus.routeName}</span>
             </div>
             <p className="text-xs font-bold text-slate-600 mb-1">Next: <span className="text-indigo-600">{bus.nextStop}</span></p>
             <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bus.status}</span>
                <span className="text-xs font-black text-slate-800">{bus.estimatedArrival}m</span>
             </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function StopMarker({ stop }: { stop: StopType, key?: string }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={stop.coordinates}
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="w-4 h-4 bg-white border-4 border-slate-800 rounded-full shadow-lg hover:scale-125 transition-transform" />
      </AdvancedMarker>
      {showInfo && (
        <InfoWindow anchor={marker} onCloseClick={() => setShowInfo(false)}>
          <div className="p-1 font-black text-xs text-slate-800">{stop.name}</div>
        </InfoWindow>
      )}
    </>
  );
}

export default function BusMap({ onBusSelect, selectedBusId, buses = MOCK_BUSES }: BusMapProps) {
  if (!hasValidKey) {
    return (
      <div className="w-full h-[400px] md:h-full bg-slate-50 rounded-[32px] border-4 border-dashed border-slate-200 flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-indigo-50 text-brand-accent rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100/50 border border-indigo-100">
             <Info size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Google Maps API Key Required</h2>
            <p className="text-slate-500 font-medium leading-relaxed">To view the live campus map, please add your Google Maps API key to the application secrets.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-4 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Setup Instructions</p>
            <ol className="text-sm font-bold text-slate-600 space-y-3 list-decimal pl-4">
              <li>Open <span className="text-slate-800">Settings</span> (gear icon, top-right)</li>
              <li>Select <span className="text-slate-800">Secrets</span></li>
              <li>Add <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            </ol>
            <p className="text-[10px] text-slate-400 font-medium italic">The app will rebuild automatically after adding the secret.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-full bg-slate-200 rounded-[32px] overflow-hidden shadow-inner border border-slate-200">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: -25.550, lng: 28.110 }}
          defaultZoom={12}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Stops */}
          {MOCK_STOPS.map((stop) => (
            <StopMarker key={stop.id} stop={stop} />
          ))}

          {/* Buses */}
          {buses.map((bus) => (
            <BusMarker 
              key={bus.id} 
              bus={bus} 
              isSelected={selectedBusId === bus.id}
              onSelect={() => onBusSelect?.(bus)}
            />
          ))}
        </Map>
      </APIProvider>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-10 hidden sm:block pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl space-y-3 pointer-events-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Fleet Status</p>
          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> On Time
          </div>
          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> Delayed
          </div>
          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
            <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> Full
          </div>
        </div>
      </div>
    </div>
  );
}
