/**
 * @file emailService.ts
 * @description Service d'envoi d'emails
 */

import nodemailer from "nodemailer";
import prisma from "../prisma";

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Vérifier la configuration SMTP
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Erreur configuration SMTP:", error);
  } else {
    console.log("✅ Serveur SMTP prêt à envoyer des emails");
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from:
        process.env.SMTP_FROM ||
        `"${process.env.APP_NAME || "Plateforme Éducative"}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      ` Email envoyé à ${options.to} - Message ID: ${info.messageId}`
    );

    return true;
  } catch (error) {
    console.error(` Erreur lors de l'envoi de l'email à ${options.to}:`, error);

    throw new Error("EMAIL_SEND_FAILED");
  }
};
