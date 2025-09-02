import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCountOutputTypeSelectObjectSchema } from './RoomCountOutputTypeSelect.schema'

export const RoomCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => RoomCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const RoomCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => RoomCountOutputTypeSelectObjectSchema).optional()
}).strict();
