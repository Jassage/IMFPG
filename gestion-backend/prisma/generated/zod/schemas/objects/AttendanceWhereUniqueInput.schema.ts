import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceWhereUniqueInputObjectSchema: z.ZodType<Prisma.AttendanceWhereUniqueInput, z.ZodTypeDef, Prisma.AttendanceWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const AttendanceWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
