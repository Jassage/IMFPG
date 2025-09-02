import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventSelectObjectSchema } from './EventSelect.schema';
import { EventIncludeObjectSchema } from './EventInclude.schema'

export const EventArgsObjectSchema = z.object({
  select: z.lazy(() => EventSelectObjectSchema).optional(),
  include: z.lazy(() => EventIncludeObjectSchema).optional()
}).strict();
export const EventArgsObjectZodSchema = z.object({
  select: z.lazy(() => EventSelectObjectSchema).optional(),
  include: z.lazy(() => EventIncludeObjectSchema).optional()
}).strict();
