import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminReviews from '../reviews/page';
import { apiClient } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContext';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

function renderWithAuth(children: React.ReactNode) {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: true, user: { id: 'a', role: 'admin', email: 'a@x.com', name: 'Admin' }, loading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
      {children}
    </AuthContext.Provider>
  );
}

describe('AdminReviews page', () => {
  it('list reviews and allows approving', async () => {
    (mockedApi.client.get as unknown as jest.Mock).mockResolvedValue({ data: { data: { reviews: [{ id: 'r1', serviceName: 'S', rating: 5, isApproved: false, createdAt: new Date().toISOString() }] } } });
    (mockedApi.client.put as unknown as jest.Mock).mockResolvedValue({});
    (mockedApi.client.delete as unknown as jest.Mock).mockResolvedValue({});

    renderWithAuth(<AdminReviews />);

    expect(screen.getByText(/Carregando avaliações/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedApi.client.get).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText(/Carregando avaliações/i)).not.toBeInTheDocument());
    // rating appears inside the row text
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
    expect(screen.getByText(/Aprovar/i)).toBeInTheDocument();
  });
});
