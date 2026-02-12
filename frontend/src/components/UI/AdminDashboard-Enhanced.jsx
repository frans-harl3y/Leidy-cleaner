/**
 * Admin Dashboard com Gráficos
 * Stats, charts, e relatórios em tempo real
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 45280,
    totalBookings: 156,
    activeClients: 89,
    averageRating: 4.7,
    monthlyGrowth: 12.5,
    pendingBookings: 8,
  });

  // Dados de receita mensal
  const revenueData = [
    { month: 'Jan', revenue: 3200, target: 3500 },
    { month: 'Fev', revenue: 3800, target: 3500 },
    { month: 'Mar', revenue: 5200, target: 4000 },
    { month: 'Abr', revenue: 4800, target: 4000 },
    { month: 'Mai', revenue: 6200, target: 5000 },
    { month: 'Jun', revenue: 7280, target: 5500 },
  ];

  // Dados de serviços mais populares
  const servicesData = [
    { name: 'Limpeza Residencial', value: 45 },
    { name: 'Limpeza Comercial', value: 32 },
    { name: 'Limpeza Profunda', value: 28 },
    { name: 'Limpeza Windows', value: 15 },
    { name: 'Carpete', value: 10 },
  ];

  // Dados de satisfação por mês
  const satisfactionData = [
    { month: 'Jan', satisfaction: 4.3 },
    { month: 'Fev', satisfaction: 4.5 },
    { month: 'Mar', satisfaction: 4.6 },
    { month: 'Abr', satisfaction: 4.7 },
    { month: 'Mai', satisfaction: 4.8 },
    { month: 'Jun', satisfaction: 4.7 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          📊 Dashboard Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análise completa de negócio e performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
              ↑ {stats.monthlyGrowth}%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
            Receita Total
          </p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            R$ {stats.totalRevenue.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Últimos 6 meses
          </p>
        </motion.div>

        {/* Total Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
              ↑ 18%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
            Total de Agendamentos
          </p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.totalBookings}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {stats.pendingBookings} pendentes
          </p>
        </motion.div>

        {/* Active Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
              ↑ 23%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
            Clientes Ativos
          </p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.activeClients}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Últimos 30 dias
          </p>
        </motion.div>

        {/* Average Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <StarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
              ↑ 2%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
            Avaliação Média
          </p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {stats.averageRating}
            </p>
            <p className="text-2xl">⭐</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {stats.totalBookings} avaliações
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            💰 Receita por Mês
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Realizado" />
              <Bar dataKey="target" fill="#10b981" name="Meta" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Satisfaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            ⭐ Taxa de Satisfação
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="satisfaction"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Satisfação"
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Services Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            🎯 Serviços Populares
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {servicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Services List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            🏆 Ranking de Serviços
          </h3>
          <div className="space-y-4">
            {servicesData.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {idx + 1}. {service.name}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(service.value / 50) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <p className="ml-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {service.value} bookings
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          ⚡ Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            📄 Relatório
          </button>
          <button className="px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
            ✉️ Email
          </button>
          <button className="px-4 py-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
            ⚙️ Config
          </button>
          <button className="px-4 py-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
            👥 Usuários
          </button>
        </div>
      </motion.div>
    </div>
  );
}
