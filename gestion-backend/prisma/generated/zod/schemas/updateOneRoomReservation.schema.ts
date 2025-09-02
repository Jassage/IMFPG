import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationIncludeObjectSchema } from './objects/RoomReservationInclude.schema';
import { RoomReservationUpdateInputObjectSchema } from './objects/RoomReservationUpdateInput.schema';
import { RoomReservationUncheckedUpdateInputObjectSchema } from './objects/RoomReservationUncheckedUpdateInput.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';

export const RoomReservationUpdateOneSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), include: RoomReservationIncludeObjectSchema.optional(), data: z.union([RoomReservationUpdateInputObjectSchema, RoomReservationUncheckedUpdateInputObjectSchema]), where: RoomReservationWhereUniqueInputObjectSchema  })