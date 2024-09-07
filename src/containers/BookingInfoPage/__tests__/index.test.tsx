import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BookingInfoPage from '../';
import { useBookingInfo } from '../useBookingInfo';

jest.mock('../useBookingInfo', () => ({
  useBookingInfo: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockedUseNavigate = require('react-router-dom').useNavigate;
const mockedUseParams = require('react-router-dom').useParams;

describe('BookingInfoPage', () => {
  beforeEach(() => {
    mockedUseNavigate.mockReturnValue(jest.fn());
    mockedUseParams.mockReturnValue({ stationId: '1', bookingId: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a loading state initially', () => {
    (useBookingInfo as jest.Mock).mockReturnValue({
      status: 'loading',
      booking: null,
      station: null,
    });

    render(
      <MemoryRouter>
        <BookingInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('booking-info-page__loading')).toBeInTheDocument();
  });

  it('should display "Not found" when an error occurs or data is missing', () => {
    (useBookingInfo as jest.Mock).mockReturnValue({
      status: 'error',
      booking: null,
      station: null,
    });

    render(
      <MemoryRouter>
        <BookingInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('booking-info-page__notfound')).toBeInTheDocument();
  });

  it('should display booking and station information when data is fetched successfully', () => {
    const mockBooking = {
      customerName: 'Customer name 1',
      startDate: new Date('2023-09-05T10:00:00'),
      endDate: new Date('2023-09-10T18:00:00'),
    };
    const mockStation = {
      name: 'Station 1',
    };

    (useBookingInfo as jest.Mock).mockReturnValue({
      status: 'success',
      booking: mockBooking,
      station: mockStation,
    });

    render(
      <MemoryRouter>
        <BookingInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByText(mockStation.name)).toBeInTheDocument();
    expect(screen.getByText(mockBooking.customerName)).toBeInTheDocument();
    expect(screen.getByTitle('Booking Start Date')).toHaveTextContent('10:00 September 5, 2023');
    expect(screen.getByTitle('Booking End Date')).toHaveTextContent('18:00 September 10, 2023');
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });

  it('should call the navigate function when the "Go back" button is clicked', () => {
    (useBookingInfo as jest.Mock).mockReturnValue({
      status: 'success',
      booking: {
        customerName: 'Customer name 1',
        startDate: new Date('2023-09-05T10:00:00'),
        endDate: new Date('2023-09-10T18:00:00'),
      },
      station: { name: 'Station 1' },
    });

    const navigateMock = jest.fn();
    mockedUseNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <BookingInfoPage />
      </MemoryRouter>
    );

    const button = screen.getByTestId('booking-info-page__goBackBtn');
    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
