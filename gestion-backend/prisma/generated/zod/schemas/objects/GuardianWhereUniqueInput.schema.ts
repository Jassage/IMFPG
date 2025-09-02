import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianWhereUniqueInputObjectSchema: z.ZodType<Prisma.GuardianWhereUniqueInput, z.ZodTypeDef, Prisma.GuardianWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const GuardianWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
