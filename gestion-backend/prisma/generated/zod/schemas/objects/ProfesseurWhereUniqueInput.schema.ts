import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ProfesseurWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProfesseurWhereUniqueInput, z.ZodTypeDef, Prisma.ProfesseurWhereUniqueInput> = z.object({
  id: z.string(),
  email: z.string(),
  userId: z.string()
}).strict();
export const ProfesseurWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  email: z.string(),
  userId: z.string()
}).strict();
