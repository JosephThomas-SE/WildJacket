import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";

export default function BookingsPage() {
  const { user } = useAuth();

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
            <div className="h-40 bg-gradient-to-br from-[#176446] to-[#0f3f2e] flex items-center justify-center text-5xl">
              {exp.emoji}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-lg font-semibold mb-1">{exp.title}</h2>
              <p className="text-slate-400 text-sm flex-1">{exp.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[#2aa170] font-semibold">{exp.price}</span>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-[#2aa170] hover:bg-[#176446] text-white text-sm rounded-xl transition-colors"
                  >
                    Book now
                  </Link>
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
    </div>
  );
}

const EXPERIENCES = [
  {
    id: 1,
    emoji: "🦁",
    title: "Serengeti Safari",
    description:
      "Witness the great migration and track the Big Five across Tanzania's iconic plains with expert naturalist guides.",
    price: "From $3,200 / person",
  },
  {
    id: 2,
    emoji: "🐋",
    title: "Baja Whale Watching",
    description:
      "Kayak alongside grey whales in their natural calving lagoons off the coast of Baja California Sur.",
    price: "From $1,800 / person",
  },
  {
    id: 3,
    emoji: "🦜",
    title: "Amazon Rainforest Trek",
    description:
      "Explore canopy trails, spot rare macaws, and sleep in a sustainable lodge deep in the Peruvian Amazon.",
    price: "From $2,400 / person",
  },
  {
    id: 4,
    emoji: "🐧",
    title: "Antarctic Expedition",
    description:
      "Journey to the edge of the world and walk among penguin colonies on one of Earth's last wild frontiers.",
    price: "From $8,500 / person",
  },
];
