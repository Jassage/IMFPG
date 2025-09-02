import { z } from 'zod';
export const PaymentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string(),
  status: z.string(),
  paidDate: z.date(),
  description: z.string(),
  academicYearId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    amount: z.number(),
    type: z.number(),
    moyen: z.number(),
    status: z.number(),
    paidDate: z.number(),
    description: z.number(),
    academicYearId: z.number(),
    academicYear: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    amount: z.number().nullable(),
    type: z.string().nullable(),
    moyen: z.string().nullable(),
    status: z.string().nullable(),
    paidDate: z.date().nullable(),
    description: z.string().nullable(),
    academicYearId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    amount: z.number().nullable(),
    type: z.string().nullable(),
    moyen: z.string().nullable(),
    status: z.string().nullable(),
    paidDate: z.date().nullable(),
    description: z.string().nullable(),
    academicYearId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));