import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantUpdateManyMutationInputObjectSchema } from './objects/EventParticipantUpdateManyMutationInput.schema';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';

export const EventParticipantUpdateManyAndReturnSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), data: EventParticipantUpdateManyMutationInputObjectSchema, where: EventParticipantWhereInputObjectSchema.optional()  }).strict()