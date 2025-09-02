import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageSelectObjectSchema } from './MessageSelect.schema';
import { MessageIncludeObjectSchema } from './MessageInclude.schema'

export const MessageArgsObjectSchema = z.object({
  select: z.lazy(() => MessageSelectObjectSchema).optional(),
  include: z.lazy(() => MessageIncludeObjectSchema).optional()
}).strict();
export const MessageArgsObjectZodSchema = z.object({
  select: z.lazy(() => MessageSelectObjectSchema).optional(),
  include: z.lazy(() => MessageIncludeObjectSchema).optional()
}).strict();
