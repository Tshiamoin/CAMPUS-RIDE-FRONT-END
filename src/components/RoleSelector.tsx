import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-indigo-600' },
    { id: 'driver', label: 'Driver', icon: Truck, color: 'bg-emerald-500' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'bg-pink-600' },
  ];

  return (
    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isActive 
                ? `${role.color} text-white shadow-lg` 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Icon size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}
