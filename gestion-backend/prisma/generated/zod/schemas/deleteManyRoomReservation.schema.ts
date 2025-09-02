import { z } from 'zod';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';

export const RoomReservationDeleteManySchema = z.object({ where: RoomReservationWhereInputObjectSchema.optional()  })