import { LiveTrafficCard } from "./LiveTrafficCard";

export function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 mt-20">

      {/* LEFT SIDE */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-black">
          Fast, Reliable & Scalable <br />
          <span className="text-primary">SMS Gateway Platform</span>
        </h1>

        <p className="text-lg md:text-xl text-black/80">
          Trusted by resellers, banks, fintech, and enterprises.
          Send <strong>50–100 SMS/sec</strong> with Jasmin SMPP.
        </p>

        <div className="flex gap-4 mt-4">
          <button className="btn-primary">Start Sending SMS</button>
          <button className="btn-primary">Watch Demo</button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <LiveTrafficCard />
    </section>
  );
}
