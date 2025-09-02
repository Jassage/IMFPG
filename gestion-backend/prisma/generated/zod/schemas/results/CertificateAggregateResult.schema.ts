import { z } from 'zod';
export const CertificateAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    type: z.number(),
    title: z.number(),
    issueDate: z.number(),
    validUntil: z.number(),
    signedBy: z.number(),
    verificationCode: z.number(),
    status: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    type: z.string().nullable(),
    title: z.string().nullable(),
    issueDate: z.date().nullable(),
    validUntil: z.date().nullable(),
    signedBy: z.string().nullable(),
    verificationCode: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    type: z.string().nullable(),
    title: z.string().nullable(),
    issueDate: z.date().nullable(),
    validUntil: z.date().nullable(),
    signedBy: z.string().nullable(),
    verificationCode: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional()});