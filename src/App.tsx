import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import BookingInfoPage from './containers/BookingInfoPage';
import WeekViewPage from './containers/WeekViewPage';
import WeekViewProvider from './containers/WeekViewPage/WeekViewProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <WeekViewPage />,
  },
  {
    path: '/station/:stationId/booking/:bookingId',
    element: <BookingInfoPage />,
  },
]);

function App() {
  return (
    <WeekViewProvider>
      <RouterProvider router={router} />
    </WeekViewProvider>
  );
}

export default App;
