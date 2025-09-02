import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const DateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.date().optional()
}).strict();
export const DateTimeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.date().optional()
}).strict();
