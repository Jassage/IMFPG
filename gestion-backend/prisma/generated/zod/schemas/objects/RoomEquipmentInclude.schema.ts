import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomArgsObjectSchema } from './RoomArgs.schema'

export const RoomEquipmentIncludeObjectSchema: z.ZodType<Prisma.RoomEquipmentInclude, z.ZodTypeDef, Prisma.RoomEquipmentInclude> = z.object({
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional()
}).strict();
export const RoomEquipmentIncludeObjectZodSchema = z.object({
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional()
}).strict();
