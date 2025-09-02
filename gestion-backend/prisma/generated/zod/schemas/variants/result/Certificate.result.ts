import { z } from 'zod';

// prettier-ignore
export const CertificateResultSchema = z.object({
    id: z.string(),
    student: z.unknown(),
    studentId: z.string(),
    type: z.string(),
    title: z.string(),
    issueDate: z.date(),
    validUntil: z.date().nullable(),
    signedBy: z.string(),
    verificationCode: z.string(),
    status: z.string()
}).strict();

export type CertificateResultType = z.infer<typeof CertificateResultSchema>;
