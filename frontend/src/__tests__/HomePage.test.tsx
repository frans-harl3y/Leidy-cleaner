import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the homepage', () => {
    render(<HomePage />);
    expect(screen.getByText(/Você Merece/i)).toBeInTheDocument();
  });
});