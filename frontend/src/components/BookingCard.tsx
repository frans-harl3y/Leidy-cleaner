"use client";

import React from 'react';
import { Booking } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Calendar, MapPin, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle, Clock3 } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  onPay?: () => void;
  showActions?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock3 className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusVariant = (status: string): "pending" | "confirmed" | "completed" | "cancelled" => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

export default function BookingCard({
  booking,
  onCancel,
  onPay,
  showActions = true
}: BookingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDate(booking.scheduledDate);

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {booking.serviceName || 'Serviço'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(booking.status)} className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              {booking.paymentStatus && (
                <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'} className="text-xs">
                  {booking.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              R$ {booking.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">{date}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {time}
              </div>
            </div>
          </div>

          {booking.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Local</div>
                <div className="text-sm text-gray-600">{booking.address}</div>
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Observações:</strong> {booking.notes}
              </div>
            </div>
          )}

          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {onPay && booking.status === 'pending' && booking.paymentStatus !== 'paid' && (
                <Button
                  onClick={onPay}
                  className="flex-1"
                  variant="default"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pagar Agora
                </Button>
              )}

              {onCancel && booking.status === 'pending' && (
                <Button
                  onClick={onCancel}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}