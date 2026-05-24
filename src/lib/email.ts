import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL || "noreply@billetdinvitation.site";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@billetdinvitation.site";

export async function sendAdminNotification(participant: {
  fullName: string;
  email: string;
  phone: string;
  translatorId: string;
  city: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Nouveau RSVP — ${participant.fullName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fdfcf8; border: 1px solid #e8d5b0;">
          <h2 style="color: #8B1A1A; font-size: 22px; margin-bottom: 8px;">Nouveau RSVP reçu</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px; letter-spacing: 1px;">中文译者年会 · Conférence annuelle</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8d0;">Nom</td><td style="padding: 8px 0; color: #222; font-size: 14px; border-bottom: 1px solid #f0e8d0;"><strong>${participant.fullName}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8d0;">E-mail</td><td style="padding: 8px 0; color: #222; font-size: 14px; border-bottom: 1px solid #f0e8d0;">${participant.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8d0;">Téléphone</td><td style="padding: 8px 0; color: #222; font-size: 14px; border-bottom: 1px solid #f0e8d0;">${participant.phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8d0;">Matricule</td><td style="padding: 8px 0; color: #222; font-size: 14px; border-bottom: 1px solid #f0e8d0;">${participant.translatorId}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Ville</td><td style="padding: 8px 0; color: #222; font-size: 14px;">${participant.city}</td></tr>
          </table>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e8d5b0;">
            <a href="${process.env.SITE_URL}/admin/dashboard" style="background: #8B1A1A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 13px;">Voir le tableau de bord →</a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email admin notification failed:", err);
  }
}

export async function sendInvitationEmail(
  participant: { fullName: string; email: string; translatorId: string },
  pdfBuffer: Buffer
) {
  try {
    await resend.emails.send({
      from: FROM,
      to: participant.email,
      subject: `Votre invitation officielle — Conférence annuelle des traducteurs chinois`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fdfcf8;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 28px; letter-spacing: 8px; color: #C9A96E; margin-bottom: 8px;">❧</div>
            <h1 style="color: #8B1A1A; font-size: 24px; font-weight: normal; letter-spacing: 2px;">INVITATION OFFICIELLE</h1>
            <p style="color: #888; font-size: 12px; letter-spacing: 3px;">中文译者年会</p>
          </div>
          <p style="color: #333; font-size: 16px; line-height: 1.8;">Cher(e) <strong>${participant.fullName}</strong>,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8; margin-top: 16px;">
            Votre participation à la <strong>Conférence Annuelle des Traducteurs Chinois</strong> a été validée.<br>
            Votre contribution de <strong>25 000 FCFA</strong> a bien été enregistrée.
          </p>
          <p style="color: #555; font-size: 15px; line-height: 1.8; margin-top: 16px;">
            Vous trouverez ci-joint votre <strong>invitation nominative officielle</strong> au format PDF.<br>
            Veuillez la conserver et la présenter le jour de l'événement.
          </p>
          <div style="background: #fdf8f0; border: 1px solid #e8d5b0; padding: 16px; border-radius: 4px; margin-top: 24px;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px; letter-spacing: 1px;">MATRICULE</p>
            <p style="color: #8B1A1A; font-size: 18px; font-weight: bold; margin: 0; letter-spacing: 2px;">${participant.translatorId}</p>
          </div>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center; letter-spacing: 1px;">
            Cette invitation est strictement nominative et non transférable.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `invitation-${participant.translatorId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return true;
  } catch (err) {
    console.error("Invitation email failed:", err);
    return false;
  }
}
