
import { format } from 'date-fns';

import type { Booking } from '../../types';

type BookingListProps = {
  bookings: Booking[];
};

const BookingList = ({ bookings }: BookingListProps) => {
  if (bookings.length === 0) {
    return <p data-testid="booking-list-no-avail" className="mt-6">No bookings available</p>;
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-lg" data-testid="booking-list-num-of-avail">
        Bookings ({bookings.length})
      </h4>
      <ul className="hidden md:flex flex-col gap-2">
        {bookings.map((booking, index) => (
          <li key={booking.id}>
            <strong>{index + 1}/</strong> {booking.customerName} <br />
            ({format(booking.startDate, 'H:mm MMMM d, yyyy')} - {format(booking.endDate, 'H:mm MMMM d, yyyy')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
