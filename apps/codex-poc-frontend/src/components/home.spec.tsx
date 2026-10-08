import { render, screen } from '@testing-library/react';
import { Home } from './home';

describe('Home', () => {
  it.each([
    [true, 'API available'],
    [false, 'Service unavailable'],
  ])('renders availability %s accessibly', (available, label) => {
    render(<Home available={available as boolean} />);
    expect(
      screen.getByRole('heading', { name: 'Sudoku Battle', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(label as string);
  });
});
