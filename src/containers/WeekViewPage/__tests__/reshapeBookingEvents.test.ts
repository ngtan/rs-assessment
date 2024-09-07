import { reshapeBookingEvents } from '../reshapeBookingEvents';
import type { Booking } from '../../../types';

describe('reshapeBookingEvents', () => {
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
      customerName: 'Jane Doe',
      startDate: '2024-09-02T11:00:00',
      endDate: '2024-09-02T13:00:00',
      pickupReturnStationId: '1',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return booking events with updated start and end dates from localStorage', () => {
    localStorage.setItem('BOOKING_1', '2024-09-01T09:00:00___2024-09-01T11:00:00');

    const result = reshapeBookingEvents(mockBookings);

    expect(result).toEqual([
      {
        id: '1',
        title: 'John Doe',
        start: '2024-09-01T09:00:00',
        end: '2024-09-01T11:00:00',
      },
      {
        id: '2',
        title: 'Jane Doe',
        start: '2024-09-02T11:00:00',
        end: '2024-09-02T13:00:00',
      },
    ]);
  });

  it('should return booking events with default start and end dates if localStorage has no values', () => {
    const result = reshapeBookingEvents(mockBookings);

    expect(result).toEqual([
      {
        id: '1',
        title: 'John Doe',
        start: '2024-09-01T10:00:00',
        end: '2024-09-01T12:00:00',
      },
      {
        id: '2',
        title: 'Jane Doe',
        start: '2024-09-02T11:00:00',
        end: '2024-09-02T13:00:00',
      },
    ]);
  });

  it('should fall back to booking values if localStorage has partial values', () => {
    localStorage.setItem('BOOKING_1', '2024-09-01T09:00:00___');

    const result = reshapeBookingEvents(mockBookings);

    expect(result).toEqual([
      {
        id: '1',
        title: 'John Doe',
        start: '2024-09-01T09:00:00',
        end: '2024-09-01T12:00:00',
      },
      {
        id: '2',
        title: 'Jane Doe',
        start: '2024-09-02T11:00:00',
        end: '2024-09-02T13:00:00',
      },
    ]);
  });

  it('should return an empty array if no bookings are provided', () => {
    const result = reshapeBookingEvents([]);

    expect(result).toEqual([]);
  });
});
