import { z } from 'zod';
import { EventParticipantCreateManyInputObjectSchema } from './objects/EventParticipantCreateManyInput.schema';

export const EventParticipantCreateManySchema = z.object({ data: z.union([ EventParticipantCreateManyInputObjectSchema, z.array(EventParticipantCreateManyInputObjectSchema) ]),  })