'use client';

/**
 * 📅 Página de Staff - Agenda e Gerenciamento
 * Para profissionais gerenciarem sua disponibilidade e solicitações
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function StaffSchedule() {
  const [schedule, setSchedule] = useState({});
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      // Aqui faria a chamada à API para carregar o schedule
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      setLoading(false);
    }
  };

  const toggleTimeSlot = (day, time) => {
    const key = `${day}-${time}`;
    const newSelected = new Set(selectedSlots);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    
    setSelectedSlots(newSelected);
  };

  const saveSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const scheduleData = Array.from(selectedSlots);
      
      // Chamada à API para salvar
      // await fetch('http://localhost:3001/api/staff/schedule', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ availability: scheduleData })
      // });
      
      alert('Agenda salva com sucesso!');
    } catch (error) {
      alert('Erro ao salvar agenda');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📅 Minha Agenda
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie sua disponibilidade e horários de trabalho
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            {[
              { id: 'schedule', label: '📅 Disponibilidade', icon: 'schedule' },
              { id: 'bookings', label: '📋 Agendamentos', icon: 'bookings' },
              { id: 'requests', label: '🔔 Solicitações', icon: 'requests' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'schedule' && (
            <ScheduleSection 
              selectedSlots={selectedSlots} 
              toggleTimeSlot={toggleTimeSlot}
              saveSchedule={saveSchedule}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsSection />
          )}

          {activeTab === 'requests' && (
            <RequestsSection />
          )}
        </div>
      </div>
    </div>
  );
}

function ScheduleSection({ selectedSlots, toggleTimeSlot, saveSchedule }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Selecione seus horários disponíveis</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Clique nos horários para marcar como disponível
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900/30">
              <th className="px-4 py-3 text-left font-semibold border border-gray-300 dark:border-gray-700">Horário</th>
              {DAYS.map(day => (
                <th key={day} className="px-3 py-3 text-center font-semibold border border-gray-300 dark:border-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700">
                  {time}h
                </td>
                {DAYS.map((day, dayIdx) => {
                  const key = `${day}-${time}`;
                  const isSelected = selectedSlots.has(key);
                  
                  return (
                    <td key={key} className="px-3 py-3 text-center border border-gray-300 dark:border-gray-700">
                      <button
                        onClick={() => toggleTimeSlot(day, time)}
                        className={`
                          w-10 h-10 rounded-lg font-bold transition-all
                          ${
                            isSelected
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-800'
                          }
                        `}
                        title={`${day} às ${time}`}
                      >
                        {isSelected ? '✓' : '-'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={saveSchedule}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          💾 Salvar Agenda
        </button>
        <button
          onClick={() => alert('Função limpar agenda não implementada')}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          🗑️ Limpar Tudo
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          ℹ️ Você tem <strong>{selectedSlots.size} horários</strong> disponíveis por semana.
        </p>
      </div>
    </div>
  );
}

function BookingsSection() {
  const bookings = [
    {
      id: 1,
      clientName: 'Maria Silva',
      service: 'Limpeza Completa',
      date: '2024-01-15',
      time: '10:00',
      duration: 2,
      status: 'confirmado',
      value: 150
    },
    {
      id: 2,
      clientName: 'João Santos',
      service: 'Organização',
      date: '2024-01-16',
      time: '14:00',
      duration: 3,
      status: 'confirmado',
      value: 180
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Seus Agendamentos</h3>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{booking.clientName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                {booking.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400">📅 Data</p>
                <p className="font-semibold">{new Date(booking.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">🕐 Horário</p>
                <p className="font-semibold">{booking.time}h</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">⏱️ Duração</p>
                <p className="font-semibold">{booking.duration}h</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">💰 Valor</p>
                <p className="font-semibold text-green-600">R$ {booking.value.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                👁️ Detalhes
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                💬 Mensagem
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsSection() {
  const requests = [
    {
      id: 1,
      clientName: 'Ana Costa',
      service: 'Limpeza Pós-Reforma',
      date: '2024-01-17',
      time: '09:00',
      duration: 4,
      status: 'pending',
      value: 250
    },
    {
      id: 2,
      clientName: 'Pedro Oliveira',
      service: 'Limpeza Profunda',
      date: '2024-01-18',
      time: '14:00',
      duration: 3,
      status: 'pending',
      value: 180
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Solicitações de Serviço</h3>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{req.clientName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{req.service}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-semibold">
                ⏳ Pendente
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">📅 Data</p>
                <p className="font-semibold">{new Date(req.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">🕐 Horário</p>
                <p className="font-semibold">{req.time}h</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">⏱️ Duração</p>
                <p className="font-semibold">{req.duration}h</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">💰 Valor</p>
                <p className="font-semibold text-green-600">R$ {req.value.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
                ✅ Aceitar
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                ❌ Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
