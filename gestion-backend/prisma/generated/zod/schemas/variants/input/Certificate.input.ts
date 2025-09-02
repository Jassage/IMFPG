import { z } from 'zod';

// prettier-ignore
export const CertificateInputSchema = z.object({
    student: z.unknown(),
    studentId: z.string(),
    type: z.string(),
    title: z.string(),
    issueDate: z.date(),
    validUntil: z.date().optional().nullable(),
    signedBy: z.string(),
    verificationCode: z.string(),
    status: z.string()
}).strict();

export type CertificateInputType = z.infer<typeof CertificateInputSchema>;
