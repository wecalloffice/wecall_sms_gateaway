interface EventCalendarBoxProps {
  events?: string[];
}

const EventCalendarBox: React.FC<EventCalendarBoxProps> = ({
  events = ["No events"],
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md h-[200px] overflow-auto">
      <h2 className="font-bold mb-2">Event Calendar</h2>
      <ul className="list-disc pl-5">
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendarBox;
