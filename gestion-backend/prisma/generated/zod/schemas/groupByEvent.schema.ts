import { z } from 'zod';
import { EventWhereInputObjectSchema } from './objects/EventWhereInput.schema';
import { EventOrderByWithAggregationInputObjectSchema } from './objects/EventOrderByWithAggregationInput.schema';
import { EventScalarWhereWithAggregatesInputObjectSchema } from './objects/EventScalarWhereWithAggregatesInput.schema';
import { EventScalarFieldEnumSchema } from './enums/EventScalarFieldEnum.schema';
import { EventCountAggregateInputObjectSchema } from './objects/EventCountAggregateInput.schema';
import { EventMinAggregateInputObjectSchema } from './objects/EventMinAggregateInput.schema';
import { EventMaxAggregateInputObjectSchema } from './objects/EventMaxAggregateInput.schema';

export const EventGroupBySchema = z.object({ where: EventWhereInputObjectSchema.optional(), orderBy: z.union([EventOrderByWithAggregationInputObjectSchema, EventOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EventScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EventScalarFieldEnumSchema), _count: z.union([ z.literal(true), EventCountAggregateInputObjectSchema ]).optional(), _min: EventMinAggregateInputObjectSchema.optional(), _max: EventMaxAggregateInputObjectSchema.optional() })