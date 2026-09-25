// ---------------------------------------------------------------
// Sends email via Resend's HTTP API instead of raw SMTP.
//
// Why: as of Sept 2025, Render's free tier blocks outbound traffic
// on SMTP ports (25, 465, 587) entirely — so Nodemailer + Gmail SMTP
// hangs until it times out on a live free-tier deploy. Resend's API
// is a plain HTTPS POST (port 443), which isn't blocked, so this
// works reliably on the free tier.
//
// Required environment variable:
//   RESEND_API_KEY   from resend.com (free tier: 100 emails/day, 3000/month)
//
// FROM_EMAIL: use "onboarding@resend.dev" to start immediately with
// no setup. Once you verify your own domain in Resend's dashboard
// (adds a couple of DNS records in GoDaddy, same idea as before),
// switch this to something like "orders@blankloom.in" for a proper
// branded sender address.
// ---------------------------------------------------------------

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send. Order was still saved.");
    return;
  }

  const fromAddress = process.env.FROM_EMAIL || "Blankloom <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      html
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errText}`);
  }
}

module.exports = { sendEmail };
