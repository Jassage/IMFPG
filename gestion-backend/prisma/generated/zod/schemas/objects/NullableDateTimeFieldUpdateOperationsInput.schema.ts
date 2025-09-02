import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const NullableDateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.date().nullish()
}).strict();
export const NullableDateTimeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.date().nullish()
}).strict();
