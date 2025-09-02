import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageWhereInputObjectSchema } from './MessageWhereInput.schema'

export const MessageScalarRelationFilterObjectSchema: z.ZodType<Prisma.MessageScalarRelationFilter, z.ZodTypeDef, Prisma.MessageScalarRelationFilter> = z.object({
  is: z.lazy(() => MessageWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => MessageWhereInputObjectSchema).optional()
}).strict();
export const MessageScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => MessageWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => MessageWhereInputObjectSchema).optional()
}).strict();
