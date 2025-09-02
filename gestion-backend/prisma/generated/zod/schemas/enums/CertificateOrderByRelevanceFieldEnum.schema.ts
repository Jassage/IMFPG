import { z } from 'zod';

export const CertificateOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'type', 'title', 'signedBy', 'verificationCode', 'status'])