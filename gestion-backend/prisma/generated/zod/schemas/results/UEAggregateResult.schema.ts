import { z } from 'zod';
export const UEAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    title: z.number(),
    credits: z.number(),
    type: z.number(),
    passingGrade: z.number(),
    description: z.number(),
    objectives: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    createdBy: z.number(),
    createdById: z.number(),
    prerequisites: z.number(),
    requiredFor: z.number(),
    assignments: z.number(),
    grades: z.number(),
    retakes: z.number()
  }).optional(),
  _sum: z.object({
    credits: z.number().nullable(),
    passingGrade: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    credits: z.number().nullable(),
    passingGrade: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    title: z.string().nullable(),
    credits: z.number().int().nullable(),
    passingGrade: z.number().int().nullable(),
    description: z.string().nullable(),
    objectives: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    createdById: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    title: z.string().nullable(),
    credits: z.number().int().nullable(),
    passingGrade: z.number().int().nullable(),
    description: z.string().nullable(),
    objectives: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    createdById: z.string().nullable()
  }).nullable().optional()});