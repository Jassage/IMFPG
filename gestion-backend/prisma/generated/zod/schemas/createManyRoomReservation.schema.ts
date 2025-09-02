import { z } from 'zod';
import { RoomReservationCreateManyInputObjectSchema } from './objects/RoomReservationCreateManyInput.schema';

export const RoomReservationCreateManySchema = z.object({ data: z.union([ RoomReservationCreateManyInputObjectSchema, z.array(RoomReservationCreateManyInputObjectSchema) ]),  })