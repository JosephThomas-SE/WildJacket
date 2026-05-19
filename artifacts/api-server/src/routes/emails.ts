import { Router, type IRouter } from "express";
import { sendBookingEmails, type BookingEmailData } from "../lib/email";

const router: IRouter = Router();

router.post("/emails/notify", async (req, res) => {
  const data = req.body as BookingEmailData;

  if (!data?.bookingRef || !data?.action) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await sendBookingEmails(data);
    res.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    res.status(500).json({ error: message });
  }
});

export default router;
