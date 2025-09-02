import { z } from 'zod';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';
import { EventParticipantOrderByWithAggregationInputObjectSchema } from './objects/EventParticipantOrderByWithAggregationInput.schema';
import { EventParticipantScalarWhereWithAggregatesInputObjectSchema } from './objects/EventParticipantScalarWhereWithAggregatesInput.schema';
import { EventParticipantScalarFieldEnumSchema } from './enums/EventParticipantScalarFieldEnum.schema';
import { EventParticipantCountAggregateInputObjectSchema } from './objects/EventParticipantCountAggregateInput.schema';
import { EventParticipantMinAggregateInputObjectSchema } from './objects/EventParticipantMinAggregateInput.schema';
import { EventParticipantMaxAggregateInputObjectSchema } from './objects/EventParticipantMaxAggregateInput.schema';

export const EventParticipantGroupBySchema = z.object({ where: EventParticipantWhereInputObjectSchema.optional(), orderBy: z.union([EventParticipantOrderByWithAggregationInputObjectSchema, EventParticipantOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EventParticipantScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EventParticipantScalarFieldEnumSchema), _count: z.union([ z.literal(true), EventParticipantCountAggregateInputObjectSchema ]).optional(), _min: EventParticipantMinAggregateInputObjectSchema.optional(), _max: EventParticipantMaxAggregateInputObjectSchema.optional() })