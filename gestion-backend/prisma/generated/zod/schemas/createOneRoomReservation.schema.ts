import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationIncludeObjectSchema } from './objects/RoomReservationInclude.schema';
import { RoomReservationCreateInputObjectSchema } from './objects/RoomReservationCreateInput.schema';
import { RoomReservationUncheckedCreateInputObjectSchema } from './objects/RoomReservationUncheckedCreateInput.schema';

export const RoomReservationCreateOneSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), include: RoomReservationIncludeObjectSchema.optional(), data: z.union([RoomReservationCreateInputObjectSchema, RoomReservationUncheckedCreateInputObjectSchema])  })