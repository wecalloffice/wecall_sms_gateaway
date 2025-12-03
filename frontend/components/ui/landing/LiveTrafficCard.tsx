export function LiveTrafficCard() {
  return (
    <div className="mt-16 md:mt-0">
      <div className="w-[420px] h-[420px] bg-primary-light/10 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl p-8">
        <h3 className="text-xl font-bold text-black mb-4">Live Traffic View</h3>

        <div className="space-y-3 text-black">
          <div className="flex justify-between">
            <span>Messages Today</span>
            <span className="font-bold">12,430</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Rate</span>
            <span className="font-bold">98.2%</span>
          </div>
          <div className="flex justify-between">
            <span>Peak TPS</span>
            <span className="font-bold">92/sec</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full h-32 bg-primary/20 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
