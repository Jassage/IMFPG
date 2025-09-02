import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentCreateManyRoomInputObjectSchema } from './RoomEquipmentCreateManyRoomInput.schema'

export const RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateManyRoomInputEnvelope, z.ZodTypeDef, Prisma.RoomEquipmentCreateManyRoomInputEnvelope> = z.object({
  data: z.union([z.lazy(() => RoomEquipmentCreateManyRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateManyRoomInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RoomEquipmentCreateManyRoomInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => RoomEquipmentCreateManyRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateManyRoomInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
