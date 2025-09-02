import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantIncludeObjectSchema } from './objects/EventParticipantInclude.schema';
import { EventParticipantCreateInputObjectSchema } from './objects/EventParticipantCreateInput.schema';
import { EventParticipantUncheckedCreateInputObjectSchema } from './objects/EventParticipantUncheckedCreateInput.schema';

export const EventParticipantCreateOneSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), include: EventParticipantIncludeObjectSchema.optional(), data: z.union([EventParticipantCreateInputObjectSchema, EventParticipantUncheckedCreateInputObjectSchema])  })