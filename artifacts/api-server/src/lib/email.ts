import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "WildJacket <bookings@wildjacket.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? "";
const APP_URL = process.env.APP_URL ?? "https://wildjacket.com";

export interface BookingEmailData {
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(n: number) {
  return `$${n.toLocaleString()}`;
}

function adminBookingLink(ref: string) {
  return `${APP_URL}/admin/booking/${ref}`;
}

function guestBookingLink(ref: string) {
  return `${APP_URL}/dashboard`;
}

// ── Email to guest ──────────────────────────────────────────────────────────

function guestSubject(d: BookingEmailData): string {
  if (d.action === "created") return `Booking confirmed — ${d.experienceTitle} [${d.bookingRef}]`;
  if (d.action === "cancelled") return `Booking cancelled — ${d.experienceTitle} [${d.bookingRef}]`;
  return `Booking updated — ${d.experienceTitle} [${d.bookingRef}]`;
}

function guestHtml(d: BookingEmailData): string {
  const actionLine =
    d.action === "created"
      ? "Your booking is <strong>confirmed</strong>."
      : d.action === "cancelled"
      ? "Your booking has been <strong>cancelled</strong>."
      : "Your booking has been <strong>updated</strong>.";

  return `
  <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <div style="background:#0f3f2e;padding:24px 32px;border-radius:16px 16px 0 0">
      <h1 style="color:#fff;margin:0;font-size:22px">🌿 WildJacket</h1>
    </div>
    <div style="background:#f5faf7;padding:32px;border-radius:0 0 16px 16px;border:1px solid #d4e9dc">
      <p style="font-size:18px;font-weight:600;margin:0 0 8px">${d.experienceEmoji} ${d.experienceTitle}</p>
      <p style="color:#555;margin:0 0 24px">${actionLine}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e0ece4">Booking ref</td><td style="padding:8px 0;font-weight:600;border-bottom:1px solid #e0ece4">${d.bookingRef}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e0ece4">Travel date</td><td style="padding:8px 0;border-bottom:1px solid #e0ece4">${formatDate(d.travelDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e0ece4">Guests</td><td style="padding:8px 0;border-bottom:1px solid #e0ece4">${d.guests}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e0ece4">Total</td><td style="padding:8px 0;font-weight:700;color:#176446;border-bottom:1px solid #e0ece4">${formatPrice(d.totalPrice)}</td></tr>
        ${d.additionalRequirements ? `<tr><td style="padding:8px 0;color:#555">Additional notes</td><td style="padding:8px 0">${d.additionalRequirements}</td></tr>` : ""}
      </table>
      <a href="${guestBookingLink(d.bookingRef)}" style="display:inline-block;margin-top:24px;background:#2aa170;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">View my bookings</a>
      <p style="margin-top:24px;font-size:12px;color:#888">WildJacket · Premium eco-tourism experiences</p>
    </div>
  </div>`;
}

// ── Email to admin ──────────────────────────────────────────────────────────

function adminSubject(d: BookingEmailData): string {
  if (d.action === "created") return `New booking — ${d.experienceTitle} [${d.bookingRef}]`;
  if (d.action === "cancelled") return `Booking cancelled — ${d.experienceTitle} [${d.bookingRef}]`;
  return `Booking updated — ${d.experienceTitle} [${d.bookingRef}]`;
}

function adminHtml(d: BookingEmailData): string {
  const actionLine =
    d.action === "created"
      ? "A new booking has been made."
      : d.action === "cancelled"
      ? "A guest has cancelled their booking."
      : "A booking has been updated.";

  return `
  <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <div style="background:#1e2535;padding:24px 32px;border-radius:16px 16px 0 0">
      <h1 style="color:#fff;margin:0;font-size:22px">🌿 WildJacket Admin</h1>
    </div>
    <div style="background:#f8fafc;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0">
      <p style="font-size:15px;color:#555;margin:0 0 20px">${actionLine}</p>
      <p style="font-size:18px;font-weight:600;margin:0 0 16px">${d.experienceEmoji} ${d.experienceTitle}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e9eef3">Booking ref</td><td style="padding:8px 0;font-weight:600;border-bottom:1px solid #e9eef3">${d.bookingRef}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e9eef3">Guest</td><td style="padding:8px 0;border-bottom:1px solid #e9eef3">${d.guestName} &lt;${d.guestEmail}&gt;</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e9eef3">Travel date</td><td style="padding:8px 0;border-bottom:1px solid #e9eef3">${formatDate(d.travelDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e9eef3">Guests</td><td style="padding:8px 0;border-bottom:1px solid #e9eef3">${d.guests}</td></tr>
        <tr><td style="padding:8px 0;color:#555;border-bottom:1px solid #e9eef3">Total</td><td style="padding:8px 0;font-weight:700;color:#176446;border-bottom:1px solid #e9eef3">${formatPrice(d.totalPrice)}</td></tr>
        ${d.additionalRequirements ? `<tr><td style="padding:8px 0;color:#555">Additional notes</td><td style="padding:8px 0">${d.additionalRequirements}</td></tr>` : ""}
      </table>
      <a href="${adminBookingLink(d.bookingRef)}" style="display:inline-block;margin-top:24px;background:#1e2535;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">View booking →</a>
      <p style="margin-top:24px;font-size:12px;color:#888">WildJacket Admin Notifications</p>
    </div>
  </div>`;
}

// ── Main send function ──────────────────────────────────────────────────────

export async function sendBookingEmails(d: BookingEmailData) {
  const emails: Promise<unknown>[] = [];

  const client = getResend();

  if (d.guestEmail) {
    emails.push(
      client.emails.send({
        from: FROM,
        to: d.guestEmail,
        subject: guestSubject(d),
        html: guestHtml(d),
      }),
    );
  }

  if (ADMIN_EMAIL) {
    emails.push(
      client.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: adminSubject(d),
        html: adminHtml(d),
      }),
    );
  }

  if (SUPER_ADMIN_EMAIL && SUPER_ADMIN_EMAIL !== ADMIN_EMAIL) {
    emails.push(
      client.emails.send({
        from: FROM,
        to: SUPER_ADMIN_EMAIL,
        subject: `[ALL] ${adminSubject(d)}`,
        html: adminHtml(d),
      }),
    );
  }

  await Promise.allSettled(emails);
}
