import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EnrollmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.EnrollmentWhereUniqueInput, z.ZodTypeDef, Prisma.EnrollmentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const EnrollmentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
