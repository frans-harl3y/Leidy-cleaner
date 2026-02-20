"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Booking } from '../../services/api';
import BookingCard from '@/components/BookingCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useToast from '@/components/useToast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const router = useRouter();
  const { success, error } = useToast();

  const load = async () => {
    try {
      const res = await apiClient.getBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      await apiClient.deleteBooking(id);
      await load();
      success('Agendamento cancelado com sucesso!', 'Cancelado');
    } catch (err: any) {
      error(err.message || 'Erro ao cancelar agendamento', 'Erro');
    }
  };

  const handlePay = (bookingId: string) => {
    router.push(`/payments?bookingId=${bookingId}`);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Meus Agendamentos
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os seus agendamentos de limpeza
          </p>
        </div>

        <Link href="/services">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-sm text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-sm text-gray-600">Confirmados</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
            <p className="text-sm text-gray-600">Concluídos</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
            <p className="text-sm text-gray-600">Cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos ({stats.total})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendentes ({stats.pending})
            </Button>
            <Button
              variant={filter === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('confirmed')}
            >
              Confirmados ({stats.confirmed})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Concluídos ({stats.completed})
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cancelled')}
            >
              Cancelados ({stats.cancelled})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? 'Você ainda não fez nenhum agendamento.'
                    : `Nenhum agendamento ${filter} encontrado.`
                  }
                </p>
                <Link href="/services">
                  <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Fazer Primeiro Agendamento
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancel(booking.id)}
                  onPay={() => handlePay(booking.id)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
