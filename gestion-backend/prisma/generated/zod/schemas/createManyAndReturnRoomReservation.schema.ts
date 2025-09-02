import { z } from 'zod';
import { RoomReservationSelectObjectSchema } from './objects/RoomReservationSelect.schema';
import { RoomReservationCreateManyInputObjectSchema } from './objects/RoomReservationCreateManyInput.schema';

export const RoomReservationCreateManyAndReturnSchema = z.object({ select: RoomReservationSelectObjectSchema.optional(), data: z.union([ RoomReservationCreateManyInputObjectSchema, z.array(RoomReservationCreateManyInputObjectSchema) ]),  }).strict()