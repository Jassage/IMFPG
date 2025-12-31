"use strict";
/**
 * @file emailService.ts
 * @description Service d'envoi d'emails
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuration du transporteur SMTP
const transporter = nodemailer_1.default.createTransport({
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
    }
    else {
        console.log("✅ Serveur SMTP prêt à envoyer des emails");
    }
});
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM ||
                `"${process.env.APP_NAME || "Plateforme Éducative"}" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments || [],
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(` Email envoyé à ${options.to} - Message ID: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error(` Erreur lors de l'envoi de l'email à ${options.to}:`, error);
        throw new Error("EMAIL_SEND_FAILED");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map