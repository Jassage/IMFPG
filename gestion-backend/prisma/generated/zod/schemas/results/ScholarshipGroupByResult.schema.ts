import { z } from 'zod';
export const ScholarshipGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  criteria: z.string(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int(),
  status: z.string(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    description: z.number(),
    amount: z.number(),
    criteria: z.number(),
    applicationDeadline: z.number(),
    academicYearId: z.number(),
    academicYear: z.number(),
    maxRecipients: z.number(),
    currentRecipients: z.number(),
    status: z.number(),
    applications: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable(),
    maxRecipients: z.number().nullable(),
    currentRecipients: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable(),
    maxRecipients: z.number().nullable(),
    currentRecipients: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    amount: z.number().nullable(),
    criteria: z.string().nullable(),
    applicationDeadline: z.date().nullable(),
    academicYearId: z.string().nullable(),
    maxRecipients: z.number().int().nullable(),
    currentRecipients: z.number().int().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    amount: z.number().nullable(),
    criteria: z.string().nullable(),
    applicationDeadline: z.date().nullable(),
    academicYearId: z.string().nullable(),
    maxRecipients: z.number().int().nullable(),
    currentRecipients: z.number().int().nullable(),
    status: z.string().nullable()
  }).nullable().optional()
}));