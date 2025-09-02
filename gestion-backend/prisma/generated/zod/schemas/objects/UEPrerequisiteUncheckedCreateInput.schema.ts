import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedCreateInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
