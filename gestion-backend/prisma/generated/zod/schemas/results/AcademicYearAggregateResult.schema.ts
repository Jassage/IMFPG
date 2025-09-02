import { z } from 'zod';
export const AcademicYearAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    year: z.number(),
    startDate: z.number(),
    endDate: z.number(),
    isCurrent: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    grades: z.number(),
    enrollments: z.number(),
    assignments: z.number(),
    payments: z.number(),
    scholarship: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    year: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    year: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});