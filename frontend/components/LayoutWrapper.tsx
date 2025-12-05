interface LayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, title }) => {
  return (
    <div className="p-4 min-h-screen bg-gray-100">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      {children}
    </div>
  );
};

export default LayoutWrapper;
