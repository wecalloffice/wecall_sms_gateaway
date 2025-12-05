interface AnnouncementsBoxProps {
  announcements?: string[];
}

const AnnouncementsBox: React.FC<AnnouncementsBoxProps> = ({
  announcements = ["No announcements"],
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md h-[200px] overflow-auto">
      <h2 className="font-bold mb-2">Announcements</h2>
      <ul className="list-disc pl-5">
        {announcements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsBox;
