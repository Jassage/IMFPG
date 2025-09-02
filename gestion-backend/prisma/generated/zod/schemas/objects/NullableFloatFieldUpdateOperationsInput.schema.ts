import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const NullableFloatFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().nullish(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();
export const NullableFloatFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.number().nullish(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();
