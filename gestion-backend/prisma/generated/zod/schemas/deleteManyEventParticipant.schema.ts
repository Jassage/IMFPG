import { z } from 'zod';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';

export const EventParticipantDeleteManySchema = z.object({ where: EventParticipantWhereInputObjectSchema.optional()  })