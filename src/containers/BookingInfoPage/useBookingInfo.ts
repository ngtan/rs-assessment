import { useEffect, useState } from 'react';
import axios from 'axios';

import type { Booking, Station } from '../../types';

export const useBookingInfo = (stationId: string, bookingId: string) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setStatus('loading');

        const [bookingRes, stationRes] = await Promise.all([
          axios.get(`https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings/${bookingId}`),
          axios.get(`https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}`),
        ]);

        setBooking(bookingRes.data);
        setStation(stationRes.data);

        setStatus('success');
      } catch (error: unknown) {
        console.error('Error fetching data:', error);

        setStatus('error');
      }
    })();
  }, []);

  return { status, booking, station };
};
