import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TranscriptCountOutputTypeSelect, z.ZodTypeDef, Prisma.TranscriptCountOutputTypeSelect> = z.object({
  grades: z.boolean().optional()
}).strict();
export const TranscriptCountOutputTypeSelectObjectZodSchema = z.object({
  grades: z.boolean().optional()
}).strict();
