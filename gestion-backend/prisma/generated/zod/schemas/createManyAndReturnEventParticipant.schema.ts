import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantCreateManyInputObjectSchema } from './objects/EventParticipantCreateManyInput.schema';

export const EventParticipantCreateManyAndReturnSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), data: z.union([ EventParticipantCreateManyInputObjectSchema, z.array(EventParticipantCreateManyInputObjectSchema) ]),  }).strict()