import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageCountOutputTypeSelectObjectSchema } from './MessageCountOutputTypeSelect.schema'

export const MessageCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => MessageCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const MessageCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => MessageCountOutputTypeSelectObjectSchema).optional()
}).strict();
