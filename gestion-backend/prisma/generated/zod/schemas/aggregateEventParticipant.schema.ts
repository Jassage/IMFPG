import { z } from 'zod';
import { EventParticipantOrderByWithRelationInputObjectSchema } from './objects/EventParticipantOrderByWithRelationInput.schema';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';
import { EventParticipantCountAggregateInputObjectSchema } from './objects/EventParticipantCountAggregateInput.schema';
import { EventParticipantMinAggregateInputObjectSchema } from './objects/EventParticipantMinAggregateInput.schema';
import { EventParticipantMaxAggregateInputObjectSchema } from './objects/EventParticipantMaxAggregateInput.schema';

export const EventParticipantAggregateSchema = z.object({ orderBy: z.union([EventParticipantOrderByWithRelationInputObjectSchema, EventParticipantOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventParticipantWhereInputObjectSchema.optional(), cursor: EventParticipantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), EventParticipantCountAggregateInputObjectSchema ]).optional(), _min: EventParticipantMinAggregateInputObjectSchema.optional(), _max: EventParticipantMaxAggregateInputObjectSchema.optional() })