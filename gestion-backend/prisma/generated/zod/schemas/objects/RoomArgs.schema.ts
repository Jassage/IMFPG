import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomSelectObjectSchema } from './RoomSelect.schema';
import { RoomIncludeObjectSchema } from './RoomInclude.schema'

export const RoomArgsObjectSchema = z.object({
  select: z.lazy(() => RoomSelectObjectSchema).optional(),
  include: z.lazy(() => RoomIncludeObjectSchema).optional()
}).strict();
export const RoomArgsObjectZodSchema = z.object({
  select: z.lazy(() => RoomSelectObjectSchema).optional(),
  include: z.lazy(() => RoomIncludeObjectSchema).optional()
}).strict();
