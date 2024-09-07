
import type { Booking } from '../../types';

export const reshapeBookingEvents = (bookings: Booking[]) => {
  return bookings.map((booking) => {
    const bookingStorage = localStorage.getItem(`BOOKING_${booking.id}`) ?? '___';
    const [newStartDate, newEndDate] = bookingStorage.split('___');

    return {
      id: booking.id,
      title: booking.customerName,
      start: newStartDate ? newStartDate : booking.startDate,
      end: newEndDate ? newEndDate : booking.endDate,
    };
  });
};
