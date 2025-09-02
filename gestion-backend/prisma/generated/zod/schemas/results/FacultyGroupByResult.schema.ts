import { z } from 'zod';
export const FacultyGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  dean: z.string(),
  studentsCount: z.number().int(),
  coursesCount: z.number().int(),
  studyDuration: z.number().int(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    code: z.number(),
    description: z.number(),
    dean: z.number(),
    studentsCount: z.number(),
    coursesCount: z.number(),
    studyDuration: z.number(),
    levels: z.number(),
    status: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    assignments: z.number(),
    enrollments: z.number()
  }).optional(),
  _sum: z.object({
    studentsCount: z.number().nullable(),
    coursesCount: z.number().nullable(),
    studyDuration: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    studentsCount: z.number().nullable(),
    coursesCount: z.number().nullable(),
    studyDuration: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    code: z.string().nullable(),
    description: z.string().nullable(),
    dean: z.string().nullable(),
    studentsCount: z.number().int().nullable(),
    coursesCount: z.number().int().nullable(),
    studyDuration: z.number().int().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    code: z.string().nullable(),
    description: z.string().nullable(),
    dean: z.string().nullable(),
    studentsCount: z.number().int().nullable(),
    coursesCount: z.number().int().nullable(),
    studyDuration: z.number().int().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));