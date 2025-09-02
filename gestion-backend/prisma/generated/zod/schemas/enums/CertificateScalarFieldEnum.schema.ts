import { z } from 'zod';

export const CertificateScalarFieldEnumSchema = z.enum(['id', 'studentId', 'type', 'title', 'issueDate', 'validUntil', 'signedBy', 'verificationCode', 'status'])