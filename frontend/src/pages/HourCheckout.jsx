/**
 * Hour Checkout Page
 * Página de compra de pacotes de horas
 */

import React, { useState } from 'react';

const HourCheckout = () => {
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');
  const [coupon, setCoupon] = useState('');
  const [finalAmount, setFinalAmount] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Simple coupon logic
  const coupons = {
    'WELCOME10': 0.10,
    'FREX': 0.15
  };

  const applyCoupon = () => {
    const a = Number(amount);
    if (!a || a <= 0) return alert('Insira um valor válido');
    const discount = coupons[coupon?.toUpperCase()] || 0;
    const reduced = +(a * (1 - discount)).toFixed(2);
    setFinalAmount(reduced);
  };

  const handleCheckout = async () => {
    if (!bookingId) return alert('Informe o bookingId');
    const toPay = finalAmount !== null ? finalAmount : Number(amount);
    if (!toPay || Number.isNaN(toPay) || toPay <= 0) return alert('Informe um valor válido');

    try {
      setProcessingPayment(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ bookingId, amount: toPay })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao iniciar checkout');
      }

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        window.open(data.sessionUrl, '_blank');
      } else {
        alert('Sessão iniciada. ID: ' + data.sessionId);
      }
    } catch (err) {
      console.error(err);
      alert('Erro: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">💳 Pagar Faxinha</h1>
          <p className="text-gray-700">Insira o ID do agendamento e o valor — opcional: cupom de desconto.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking ID</label>
              <input type="text" value={bookingId} onChange={e => setBookingId(e.target.value)} className="mt-2 w-full p-3 border rounded" placeholder="ex: 12345" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-2 w-full p-3 border rounded" placeholder="ex: 79.90" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cupom (opcional)</label>
              <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} className="mt-2 w-full p-3 border rounded" placeholder="WELCOME10" />
            </div>

            <div className="flex items-end">
              <button onClick={applyCoupon} className="btn btn-primary w-full">Aplicar Cupom</button>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-600">Total:</p>
            <p className="text-3xl font-bold text-indigo-700">R$ {finalAmount !== null ? finalAmount.toFixed(2) : (amount ? Number(amount).toFixed(2) : '0.00')}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button disabled={processingPayment} onClick={handleCheckout} className="btn btn-cta-glow w-full">
                {processingPayment ? '⏳ Iniciando...' : '→ Pagar Agora'}
              </button>
              <button onClick={() => { setBookingId(''); setAmount(''); setCoupon(''); setFinalAmount(null); }} className="btn btn-outline w-full">Limpar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourCheckout;
