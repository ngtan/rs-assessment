import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import WeekViewPage from '../';
import { useQueryStation } from '../useQueryStation';
import { useWeekView } from '../WeekViewProvider';

jest.mock('../useQueryStation');
jest.mock('../WeekViewProvider');
jest.mock('@fullcalendar/react', () => jest.fn(() => <div data-testid="fullcalendar" />));

const mockStations = [
  { id: '1', name: 'Station 1', bookings: [] },
  { id: '2', name: 'Station 2', bookings: [{ id: 'b1', customerName: 'John Doe', startDate: '2024-09-01T10:00:00', endDate: '2024-09-01T12:00:00' }] }
];

const mockSelectedStation = mockStations[1];

describe('WeekViewPage', () => {
  beforeEach(() => {
    (useQueryStation as jest.Mock).mockReturnValue({
      stations: mockStations,
      queryStation: jest.fn(),
    });
    (useWeekView as jest.Mock).mockReturnValue({
      selectedStation: mockSelectedStation,
      setSelectedStation: jest.fn(),
    });
  });

  it('renders Autocomplete and FullCalendar components', () => {
    render(
      <MemoryRouter>
        <WeekViewPage />
      </MemoryRouter>
    );

    const autocomplete = screen.getByRole('combobox');
    expect(autocomplete).toBeInTheDocument();
  });

  it('renders bookings list for selected station', () => {
    render(
      <MemoryRouter>
        <WeekViewPage />
      </MemoryRouter>
    );

    const bookingItem = screen.getByText(/John Doe/i);
    expect(bookingItem).toBeInTheDocument();
    expect(screen.getByText(/10:00 September 1, 2024 - 12:00 September 1, 2024/i)).toBeInTheDocument();
  });
});
