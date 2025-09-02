import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageWhereUniqueInputObjectSchema: z.ZodType<Prisma.MessageWhereUniqueInput, z.ZodTypeDef, Prisma.MessageWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const MessageWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
