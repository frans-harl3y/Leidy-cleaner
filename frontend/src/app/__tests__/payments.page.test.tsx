import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PaymentsPage from '../payments/page';
import { apiClient } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

jest.mock('@/services/api');
jest.mock('next/navigation', () => ({ useRouter: jest.fn(), useSearchParams: jest.fn() }));
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

const pushMock = jest.fn();
const searchParamsMock = { get: jest.fn(() => 'b1') };
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });
((require('next/navigation') as any).useSearchParams as jest.Mock).mockReturnValue(searchParamsMock);

function renderWithAuth(children: React.ReactNode) {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: true, user: { id: 'u1', role: 'customer' }, login: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
      {children}
    </AuthContext.Provider>
  );
}

describe('PaymentsPage', () => {
  beforeEach(() => {
    mockedApi.getBookingById.mockClear();
    mockedApi.createPixPayment.mockClear();
  });

  it('generates PIX QR code when payment initiated', async () => {
    mockedApi.getBookingById.mockResolvedValue({ id: 'b1', totalPrice: 100, serviceName: 'S', status: 'pending' } as any);
    mockedApi.createPixPayment.mockResolvedValue({ qrCode: 'base64qr', pixKey: '51980330422', amount: 100 });

    // render and wait for initial booking load
    await act(async () => {
      renderWithAuth(<PaymentsPage />);
    });

    await waitFor(() => expect(mockedApi.getBookingById).toHaveBeenCalled());

    const button = await screen.findByText(/Gerar PIX/i);
    fireEvent.click(button);

    await waitFor(() => expect(mockedApi.createPixPayment).toHaveBeenCalled());
    expect(await screen.findByText(/PIX gerado com sucesso/i)).toBeInTheDocument();
  });
});
