import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantIncludeObjectSchema } from './objects/EventParticipantInclude.schema';
import { EventParticipantUpdateInputObjectSchema } from './objects/EventParticipantUpdateInput.schema';
import { EventParticipantUncheckedUpdateInputObjectSchema } from './objects/EventParticipantUncheckedUpdateInput.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';

export const EventParticipantUpdateOneSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), include: EventParticipantIncludeObjectSchema.optional(), data: z.union([EventParticipantUpdateInputObjectSchema, EventParticipantUncheckedUpdateInputObjectSchema]), where: EventParticipantWhereUniqueInputObjectSchema  })