import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptWhereUniqueInputObjectSchema: z.ZodType<Prisma.TranscriptWhereUniqueInput, z.ZodTypeDef, Prisma.TranscriptWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const TranscriptWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
