import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const StudentWhereUniqueInputObjectSchema: z.ZodType<Prisma.StudentWhereUniqueInput, z.ZodTypeDef, Prisma.StudentWhereUniqueInput> = z.object({
  id: z.string(),
  studentId: z.string(),
  email: z.string(),
  userId: z.string()
}).strict();
export const StudentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  email: z.string(),
  userId: z.string()
}).strict();
