import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { BookingModal } from "@/components/BookingModal";
import { EXPERIENCES, type Experience } from "@/lib/bookings";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const { user } = useAuth();
  const { book } = useBookings();
  const [selected, setSelected] = useState<Experience | null>(null);

  async function handleConfirm(guests: number, travelDate: string) {
    if (!selected) return;
    await book(selected, guests, travelDate);
    toast.success(`${selected.title} booked! Check your dashboard.`);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#0f3f2e] mb-2">Experiences</h1>
      <p className="text-slate-500 mb-8">
        Discover and book premium eco-tourism adventures in the world's most
        breathtaking wild places.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl bg-[#1e2535] text-white overflow-hidden shadow-lg flex flex-col"
          >
            <div className="h-40 bg-gradient-to-br from-[#176446] to-[#0f3f2e] flex flex-col items-center justify-center gap-1">
              <span className="text-5xl">{exp.emoji}</span>
              <span className="text-xs text-green-300 uppercase tracking-wider font-medium">
                {exp.location} · {exp.duration}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-lg font-semibold mb-1">{exp.title}</h2>
              <p className="text-slate-400 text-sm flex-1">{exp.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[#2aa170] font-semibold">{exp.price}</span>
                {user ? (
                  <button
                    onClick={() => setSelected(exp)}
                    className="px-4 py-2 bg-[#2aa170] hover:bg-[#176446] text-white text-sm rounded-xl transition-colors"
                  >
                    Book now
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-[#2aa170] hover:bg-[#176446] text-white text-sm rounded-xl transition-colors"
                  >
                    Sign in to book
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <BookingModal
          experience={selected}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
