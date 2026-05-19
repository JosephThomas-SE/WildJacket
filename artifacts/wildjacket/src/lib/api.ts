export interface BookingEmailPayload {
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  experienceTitle: string;
  experienceEmoji: string;
  guests: number;
  travelDate: string;
  totalPrice: number;
  additionalRequirements?: string | null;
  action: "created" | "updated" | "cancelled";
}

const API_BASE = "/api";

export async function notifyBooking(payload: BookingEmailPayload): Promise<void> {
  try {
    await fetch(`${API_BASE}/emails/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Email failures are non-blocking — don't surface to the user
  }
}
