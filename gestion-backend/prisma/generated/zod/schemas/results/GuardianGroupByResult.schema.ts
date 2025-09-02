import { z } from 'zod';
export const GuardianGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    firstName: z.number(),
    lastName: z.number(),
    relationship: z.number(),
    phone: z.number(),
    email: z.number(),
    address: z.number(),
    isPrimary: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    relationship: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    relationship: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));