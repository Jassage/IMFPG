import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const StringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();
export const StringFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.string().optional()
}).strict();
