import { z } from 'zod';
import { EventParticipantUpdateManyMutationInputObjectSchema } from './objects/EventParticipantUpdateManyMutationInput.schema';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';

export const EventParticipantUpdateManySchema = z.object({ data: EventParticipantUpdateManyMutationInputObjectSchema, where: EventParticipantWhereInputObjectSchema.optional()  })