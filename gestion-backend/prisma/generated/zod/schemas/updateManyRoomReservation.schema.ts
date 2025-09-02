import { z } from 'zod';
import { RoomReservationUpdateManyMutationInputObjectSchema } from './objects/RoomReservationUpdateManyMutationInput.schema';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';

export const RoomReservationUpdateManySchema = z.object({ data: RoomReservationUpdateManyMutationInputObjectSchema, where: RoomReservationWhereInputObjectSchema.optional()  })