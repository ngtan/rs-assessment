import { useNavigate, useParams } from 'react-router-dom';
import { format, formatDistanceStrict } from 'date-fns';

import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as ClockIcon } from '../../assets/icons/clock.svg';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { useBookingInfo } from './useBookingInfo';

const BookingInfoPage = () => {
  const navigate = useNavigate();
  const { stationId = '', bookingId = ''} = useParams();
  const { status, booking, station } = useBookingInfo(stationId, bookingId);

  const goBackHandler = () => {
    navigate(-1)
  };

  if (status === 'idle' || status === 'loading') {
    return (
      <div data-testid="booking-info-page__loading">Loading ....</div>
    );
  }

  if (status === 'error' || booking === null || station === null) {
    return (
      <div data-testid="booking-info-page__notfound">Not found</div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px', marginInline: 'auto', maxInlineSize: '1440px', flex: '1 1 auto', inlineSize: '100%' }}>
      <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 4px 10px rgb(46 38 61 / 0.2)', borderRadius: '4px' }}>
        <h3 className="text-2xl text-center font-bold">Booking Information</h3>
        <div className="flex flex-col md:flex-row overflow-hidden mt-6">
          <img className="w-full md:w-80" src="https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=3270&amp;q=80" alt="Sunset in the mountains" />
          <div className="px-6 py-4">
            <ul className="flex flex-col gap-2">
              <li className="flex gap-2" title="Pickup-Return Station Name">
                <span className="inline-block w-6 flex-none">
                  <LocationIcon />
                </span>
                <span>
                  {station.name}
                </span>
              </li>
              <li className="flex gap-2" title="Customer name">
                <span className="inline-block w-6 flex-none">
                  <UserIcon />
                </span>
                <span>
                  {booking.customerName}
                </span>
              </li>
              <li className="flex gap-2" title="Booking Start Date - Booking End Date">
                <span className="inline-block w-6 flex-none">
                  <CalendarIcon />
                </span>
                <div>
                  <span title="Booking Start Date">{format(booking.startDate, 'H:mm MMMM d, yyyy')}</span>
                  <span>{' - '}</span>
                  <span title="Booking End Date">{format(booking.endDate, 'H:mm MMMM d, yyyy')}</span>
                </div>
              </li>
              <li className="flex gap-2" title="Booking Duration">
                <span className="inline-block w-6 flex-none">
                  <ClockIcon />
                </span>
                <span>
                  {formatDistanceStrict(booking.endDate, booking.startDate, { unit: 'day' })}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5">
          <button
            data-testid="booking-info-page__goBackBtn"
            onClick={goBackHandler}
            className="block rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Go back
          </button>
        </div>
    </div>
  );
};

export default BookingInfoPage;
