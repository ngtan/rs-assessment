export type Booking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
};

export type Station = {
  id: string;
  name: string;
  bookings: Booking[];
};
