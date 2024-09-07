import { renderHook } from '@testing-library/react';
import axios from 'axios';

import { useBookingInfo } from '../useBookingInfo';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useBookingInfo', () => {
  const stationId = '1';
  const bookingId = '1';
  const mockBooking = { id: '1', name: 'Test Booking' };
  const mockStation = { id: '1', name: 'Test Station' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => useBookingInfo(stationId, bookingId));

    expect(result.current.booking).toBeNull();
    expect(result.current.station).toBeNull();
  });

  it('should fetch booking and station data and update state on success', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockBooking })
      .mockResolvedValueOnce({ data: mockStation });

    const { result } = renderHook(() => useBookingInfo(stationId, bookingId));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(result.current.status).toBe('success');
    expect(result.current.booking).toEqual(mockBooking);
    expect(result.current.station).toEqual(mockStation);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('should set status to error if fetching data fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useBookingInfo(stationId, bookingId));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(result.current.status).toBe('error');
    expect(result.current.booking).toBeNull();
    expect(result.current.station).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });
});
