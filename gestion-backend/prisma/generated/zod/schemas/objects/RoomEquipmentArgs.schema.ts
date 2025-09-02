import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentSelectObjectSchema } from './RoomEquipmentSelect.schema';
import { RoomEquipmentIncludeObjectSchema } from './RoomEquipmentInclude.schema'

export const RoomEquipmentArgsObjectSchema = z.object({
  select: z.lazy(() => RoomEquipmentSelectObjectSchema).optional(),
  include: z.lazy(() => RoomEquipmentIncludeObjectSchema).optional()
}).strict();
export const RoomEquipmentArgsObjectZodSchema = z.object({
  select: z.lazy(() => RoomEquipmentSelectObjectSchema).optional(),
  include: z.lazy(() => RoomEquipmentIncludeObjectSchema).optional()
}).strict();
