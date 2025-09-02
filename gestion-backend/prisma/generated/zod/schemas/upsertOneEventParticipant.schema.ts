import { z } from 'zod';
import { EventParticipantSelectObjectSchema } from './objects/EventParticipantSelect.schema';
import { EventParticipantIncludeObjectSchema } from './objects/EventParticipantInclude.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';
import { EventParticipantCreateInputObjectSchema } from './objects/EventParticipantCreateInput.schema';
import { EventParticipantUncheckedCreateInputObjectSchema } from './objects/EventParticipantUncheckedCreateInput.schema';
import { EventParticipantUpdateInputObjectSchema } from './objects/EventParticipantUpdateInput.schema';
import { EventParticipantUncheckedUpdateInputObjectSchema } from './objects/EventParticipantUncheckedUpdateInput.schema';

export const EventParticipantUpsertSchema = z.object({ select: EventParticipantSelectObjectSchema.optional(), include: EventParticipantIncludeObjectSchema.optional(), where: EventParticipantWhereUniqueInputObjectSchema, create: z.union([ EventParticipantCreateInputObjectSchema, EventParticipantUncheckedCreateInputObjectSchema ]), update: z.union([ EventParticipantUpdateInputObjectSchema, EventParticipantUncheckedUpdateInputObjectSchema ])  })