import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';

import BookingList from '../BookingList';
import type { Booking } from '../../../types';

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Doe',
    startDate: '2024-09-01T10:00:00',
    endDate: '2024-09-01T12:00:00',
    pickupReturnStationId: '1',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    startDate: '2024-09-02T08:00:00',
    endDate: '2024-09-02T10:00:00',
    pickupReturnStationId: '1',
  },
];

describe('BookingList Component', () => {
  test('renders message when no bookings are available', () => {
    render(<BookingList bookings={[]} />);

    const noBookingElement = screen.getByTestId('booking-list-no-avail');
    expect(noBookingElement).toBeInTheDocument();
  });

  test('renders list of bookings correctly', () => {
    render(<BookingList bookings={mockBookings} />);

    const headerElement = screen.getByTestId('booking-list-num-of-avail');
    expect(headerElement).toBeInTheDocument();

    mockBookings.forEach((booking, index) => {
      const customerName = screen.getByText(new RegExp(booking.customerName, 'i'));
      const startDate = screen.getByText(
        new RegExp(
          `${format(new Date(booking.startDate), 'H:mm MMMM d, yyyy')}`,
          'i'
        )
      );
      const endDate = screen.getByText(
        new RegExp(
          `${format(new Date(booking.endDate), 'H:mm MMMM d, yyyy')}`,
          'i'
        )
      );

      expect(customerName).toBeInTheDocument();
      expect(startDate).toBeInTheDocument();
      expect(endDate).toBeInTheDocument();
    });
  });

  test('displays the correct number of bookings', () => {
    render(<BookingList bookings={mockBookings} />);

    const header = screen.getByText(/Bookings \(2\)/i);
    expect(header).toBeInTheDocument();
  });
});
