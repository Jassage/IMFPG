import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema'

export const StudentCreateManyInputObjectSchema: z.ZodType<Prisma.StudentCreateManyInput, z.ZodTypeDef, Prisma.StudentCreateManyInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  studentId: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.string().nullish(),
  address: z.string().nullish(),
  photo: z.string().nullish(),
  bloodGroup: z.string().nullish(),
  allergies: z.string().nullish(),
  disabilities: z.string().nullish(),
  status: StudentStatusSchema.optional(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const StudentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  studentId: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.string().nullish(),
  address: z.string().nullish(),
  photo: z.string().nullish(),
  bloodGroup: z.string().nullish(),
  allergies: z.string().nullish(),
  disabilities: z.string().nullish(),
  status: StudentStatusSchema.optional(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
