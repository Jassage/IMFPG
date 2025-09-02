import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationIncludeObjectSchema } from './objects/RoomReservationInclude.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';

export const RoomReservationDeleteOneSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), include: RoomReservationIncludeObjectSchema.optional(), where: RoomReservationWhereUniqueInputObjectSchema  })