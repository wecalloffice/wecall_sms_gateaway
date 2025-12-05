interface UserCardProps {
  type: "admin" | "teacher" | "student" | "parent";
  count?: number;
}

const UserCard: React.FC<UserCardProps> = ({ type, count = 0 }) => {
  const colors: Record<string, string> = {
    admin: "bg-blue-200",
    teacher: "bg-green-200",
    student: "bg-yellow-200",
    parent: "bg-pink-200",
  };

  return (
    <div className={`${colors[type]} rounded p-4 w-32 text-center`}>
      <h3 className="font-bold capitalize">{type}</h3>
      <p className="text-lg">{count} Users</p>
    </div>
  );
};

export default UserCard;
