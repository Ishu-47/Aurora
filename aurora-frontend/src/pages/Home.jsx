import Navbar from "../components/Navbar";

function Home() {
  return (
    <div
      className="
        min-h-screen
        bg-linear-to-br
        from-slate-950
        via-purple-950
        to-indigo-950
      "
    >
      <Navbar />

      <div
        className="
          max-w-4xl
          mx-auto
          px-4
          py-8
        "
      >
        <h2 className="text-white text-3xl font-bold">
          Home Feed
        </h2>
      </div>
    </div>
  );
}

export default Home;