import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantIncludeObjectSchema } from './objects/EventParticipantInclude.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';

export const EventParticipantFindUniqueSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), include: EventParticipantIncludeObjectSchema.optional(), where: EventParticipantWhereUniqueInputObjectSchema })