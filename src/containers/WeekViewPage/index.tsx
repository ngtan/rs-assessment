import { useNavigate } from 'react-router-dom';
import { EventChangeArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { format } from 'date-fns';

import Autocomplete from '../../components/Autocomplete/Autocomplete';
import BookingList from './BookingList';
import { reshapeBookingEvents } from './reshapeBookingEvents';
import { useQueryStation } from './useQueryStation';
import { useWeekView } from './WeekViewProvider';

const WeekViewPage = () => {
  const navigate = useNavigate();
  const { stations, queryStation } = useQueryStation();
  const { selectedStation, setSelectedStation } = useWeekView();

  const handleEventClick = (eventClickInfo: EventClickArg) => {
    if (selectedStation) {
      navigate(`/station/${selectedStation.id}/booking/${eventClickInfo.event.id}`);
    }
  };

  const handleEventChange = (eventChangeInfo: EventChangeArg) => {
    console.log(`Calling API for updating booking information with BOOKING_ID = ${eventChangeInfo.event.id}!`);
    localStorage.setItem(`BOOKING_${eventChangeInfo.event.id}`, `${eventChangeInfo.event.startStr}___${eventChangeInfo.event.endStr}`);
    console.log(`Updated booking information successfully with BOOKING_ID = ${eventChangeInfo.event.id}!`);
  };

  return (
    <div className="container p-2 md:p-4 lg:p-6 mx-auto">
      <div className="bg-white shadow-lg rounded">
        <div className="flex flex-col md:flex-row relative rounded-md">
          <div  className="p-2 md:p-4 lg:p-6 w-full md:max-w-xs flex-none">
            <Autocomplete
              options={stations}
              renderInput={(inputProps) => <input type="text" placeholder="Search station ..." className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" {...inputProps} />}
              renderOption={(option) => <li>{option.name}</li>}
              onInputChange={(e, value) => queryStation(value)}
              onOptionClick={(e, value) => setSelectedStation(value)}
              getOptionLabel={(option) => option.name}
            />
            <hr />
            <BookingList bookings={selectedStation ? selectedStation.bookings : []} />
          </div>
          <div className="p-2 md:p-4 lg:p-6 flex-grow overflow-visible">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev today next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              initialView="dayGridMonth"
              events={selectedStation === null ? undefined : reshapeBookingEvents(selectedStation.bookings)}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              eventChange={handleEventChange}
              editable
              selectable
              selectMirror
              dayMaxEvents
            />
          </div>
        </div>
      </div>
    </div>
  );
};


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <span>{eventInfo.event.title} ({format(eventInfo.event.startStr, 'H:mm MMMM d, yyyy')} - {format(eventInfo.event.endStr, 'H:mm MMMM d, yyyy')})</span>
  );
}

export default WeekViewPage;
