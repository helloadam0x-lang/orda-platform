export default function Home() {
  return (
    <div
      style={{ backgroundColor: "#111111" }}
      className="min-h-screen flex flex-col items-center justify-center gap-8"
    >
      <h1 className="text-white text-4xl font-bold tracking-tight">
        Orda — Coming Soon
      </h1>
      <button
        style={{ backgroundColor: "#7C3AED" }}
        className="text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
      >
        Get Early Access
      </button>
    </div>
  );
}
