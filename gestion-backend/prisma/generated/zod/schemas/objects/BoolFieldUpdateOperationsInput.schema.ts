import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BoolFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();
export const BoolFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.boolean().optional()
}).strict();
