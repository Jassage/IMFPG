import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomArgsObjectSchema } from './RoomArgs.schema'

export const RoomEquipmentSelectObjectSchema: z.ZodType<Prisma.RoomEquipmentSelect, z.ZodTypeDef, Prisma.RoomEquipmentSelect> = z.object({
  id: z.boolean().optional(),
  roomId: z.boolean().optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  name: z.boolean().optional()
}).strict();
export const RoomEquipmentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  roomId: z.boolean().optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  name: z.boolean().optional()
}).strict();
