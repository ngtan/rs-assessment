import { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

import type { Station } from '../../types';

export const useQueryStation = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [stations, setStations] = useState<Station[]>([]);

  const queryStation = useCallback(
    debounce(async (value: string) => {
      if (value.length >= 2) {
        try {
          setStatus('loading');
          
          const res = await axios.get(`https://605c94c36d85de00170da8b4.mockapi.io/stations?search=${value}`);
          setStations(res.data);

          setStatus('success');
        } catch (error) {
          console.error('Error fetching data:', error);
          setStatus('error');
        }
      } else {
        setStations([]);
      }
    }, 300),
    []
  );

  return { status, stations, queryStation };
};
