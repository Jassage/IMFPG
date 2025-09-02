import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationIncludeObjectSchema } from './objects/RoomReservationInclude.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';
import { RoomReservationCreateInputObjectSchema } from './objects/RoomReservationCreateInput.schema';
import { RoomReservationUncheckedCreateInputObjectSchema } from './objects/RoomReservationUncheckedCreateInput.schema';
import { RoomReservationUpdateInputObjectSchema } from './objects/RoomReservationUpdateInput.schema';
import { RoomReservationUncheckedUpdateInputObjectSchema } from './objects/RoomReservationUncheckedUpdateInput.schema';

export const RoomReservationUpsertSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), include: RoomReservationIncludeObjectSchema.optional(), where: RoomReservationWhereUniqueInputObjectSchema, create: z.union([ RoomReservationCreateInputObjectSchema, RoomReservationUncheckedCreateInputObjectSchema ]), update: z.union([ RoomReservationUpdateInputObjectSchema, RoomReservationUncheckedUpdateInputObjectSchema ])  })