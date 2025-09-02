import { z } from 'zod';
export const CourseAssignmentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    ue: z.number(),
    ueId: z.number(),
    faculty: z.number(),
    facultyId: z.number(),
    professeur: z.number(),
    professeurId: z.number(),
    academicYearId: z.number(),
    academicYear: z.number(),
    semester: z.number(),
    level: z.number(),
    facultyLevel: z.number(),
    facultyLevelId: z.number(),
    schedules: z.number(),
    status: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    ueId: z.string().nullable(),
    facultyId: z.string().nullable(),
    professeurId: z.string().nullable(),
    academicYearId: z.string().nullable(),
    level: z.string().nullable(),
    facultyLevelId: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    ueId: z.string().nullable(),
    facultyId: z.string().nullable(),
    professeurId: z.string().nullable(),
    academicYearId: z.string().nullable(),
    level: z.string().nullable(),
    facultyLevelId: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});