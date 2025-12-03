export function FeaturesSection() {
  return (
    <section id="features" className="mt-32 bg-white py-24 px-10">
      <h2 className="text-4xl font-extrabold text-center mb-16 text-primary">
        Platform Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div className="p-8 border rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="font-bold text-2xl mb-3 text-black">High Throughput</h3>
          <p className="text-black/80">Send 50–100 SMS/sec using Jasmin SMPP TRX.</p>
        </div>

        <div className="p-8 border rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="font-bold text-2xl mb-3 text-black">Reseller Ready</h3>
          <p className="text-black/80">White-label, multi-tenant, with billing & routing.</p>
        </div>

        <div className="p-8 border rounded-xl shadow-md hover:shadow-xl transition">
          <h3 className="font-bold text-2xl mb-3 text-black">Analytics</h3>
          <p className="text-black/80">DLRs, TPS, logs, operators, routing performance.</p>
        </div>

      </div>
    </section>
  );
}
