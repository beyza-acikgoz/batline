import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // 587 için false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // şirket içi SMTP için kritik
  }
});

export async function sendResetMail(email: string, link: string) {
  await transporter.sendMail({
    from: `"Karluna MES" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Şifre Yenileme",
    html: `
      <h2>Şifre Yenileme</h2>
      <p>Aşağıdaki linkten şifrenizi yenileyebilirsiniz:</p>
      <a href="${link}">${link}</a>
      <p>Bu link 30 dakika geçerlidir.</p>
    `
  });
}
