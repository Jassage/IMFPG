import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationUpdateManyMutationInputObjectSchema } from './objects/RoomReservationUpdateManyMutationInput.schema';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';

export const RoomReservationUpdateManyAndReturnSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), data: RoomReservationUpdateManyMutationInputObjectSchema, where: RoomReservationWhereInputObjectSchema.optional()  }).strict()