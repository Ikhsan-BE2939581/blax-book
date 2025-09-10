import { HeroActions } from "@/components/molecules/HeroActions/HeroActions";

export default function Hero() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-sky-500 to-blue-600 text-white overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
            alt="Football player"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/40 to-blue-600/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 py-20 pt-32 flex items-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Booking Futsal & Mini Soccer
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 drop-shadow-md">
              Bergabung dengan komunitas football terbesar di Jakarta
            </p>
            <HeroActions />
          </div>
        </div>
      </section>
    </>
  );
}
