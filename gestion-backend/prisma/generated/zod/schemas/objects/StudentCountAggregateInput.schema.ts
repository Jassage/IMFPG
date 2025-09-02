import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const StudentCountAggregateInputObjectSchema: z.ZodType<Prisma.StudentCountAggregateInputType, z.ZodTypeDef, Prisma.StudentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  dateOfBirth: z.literal(true).optional(),
  placeOfBirth: z.literal(true).optional(),
  address: z.literal(true).optional(),
  photo: z.literal(true).optional(),
  bloodGroup: z.literal(true).optional(),
  allergies: z.literal(true).optional(),
  disabilities: z.literal(true).optional(),
  status: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const StudentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  dateOfBirth: z.literal(true).optional(),
  placeOfBirth: z.literal(true).optional(),
  address: z.literal(true).optional(),
  photo: z.literal(true).optional(),
  bloodGroup: z.literal(true).optional(),
  allergies: z.literal(true).optional(),
  disabilities: z.literal(true).optional(),
  status: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
