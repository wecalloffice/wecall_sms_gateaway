interface PlaceholderChartProps {
  title: string;
  height?: string;
  bgColor?: string;
}

const PlaceholderChart: React.FC<PlaceholderChartProps> = ({
  title,
  height = "h-[300px]",
  bgColor = "bg-gray-200",
}) => {
  return (
    <div className={`${bgColor} ${height} flex items-center justify-center rounded-md`}>
      <span>{title}</span>
    </div>
  );
};

export default PlaceholderChart;
