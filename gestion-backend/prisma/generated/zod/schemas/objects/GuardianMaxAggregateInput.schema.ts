import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianMaxAggregateInputObjectSchema: z.ZodType<Prisma.GuardianMaxAggregateInputType, z.ZodTypeDef, Prisma.GuardianMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  relationship: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  email: z.literal(true).optional(),
  address: z.literal(true).optional(),
  isPrimary: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const GuardianMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  relationship: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  email: z.literal(true).optional(),
  address: z.literal(true).optional(),
  isPrimary: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
