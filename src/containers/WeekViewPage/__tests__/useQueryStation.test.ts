import { renderHook, act } from '@testing-library/react';
import axios from 'axios';

import { useQueryStation } from '../useQueryStation';

jest.mock('axios');
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: any) => {
    fn.cancel = jest.fn();
    return fn;
  },
}));

describe('useQueryStation', () => {
  const mockStations = [
    { id: '1', name: 'Station 1' },
    { id: '2', name: 'Station 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => useQueryStation());
    
    expect(result.current.stations).toEqual([]);
    expect(result.current.queryStation).toBeDefined();
  });

  it('should set status to loading and fetch stations successfully for a valid search term', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockStations });

    const { result } = renderHook(() => useQueryStation());

    act(() => {
      result.current.queryStation('sta');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.stations).toEqual(mockStations);
  });

  it('should set status to error if fetching stations fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useQueryStation());

    act(() => {
      result.current.queryStation('sta');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.stations).toEqual([]);
  });

  it('should not fetch stations if search term is shorter than 2 characters', () => {
    const { result } = renderHook(() => useQueryStation());

    act(() => {
      result.current.queryStation('s');
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.stations).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });
});
