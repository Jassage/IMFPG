import { z } from 'zod';
import { ScheduleOrderByWithRelationInputObjectSchema } from './objects/ScheduleOrderByWithRelationInput.schema';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';
import { ScheduleCountAggregateInputObjectSchema } from './objects/ScheduleCountAggregateInput.schema';
import { ScheduleMinAggregateInputObjectSchema } from './objects/ScheduleMinAggregateInput.schema';
import { ScheduleMaxAggregateInputObjectSchema } from './objects/ScheduleMaxAggregateInput.schema';
import { ScheduleAvgAggregateInputObjectSchema } from './objects/ScheduleAvgAggregateInput.schema';
import { ScheduleSumAggregateInputObjectSchema } from './objects/ScheduleSumAggregateInput.schema';

export const ScheduleAggregateSchema = z.object({ orderBy: z.union([ScheduleOrderByWithRelationInputObjectSchema, ScheduleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScheduleWhereInputObjectSchema.optional(), cursor: ScheduleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ScheduleCountAggregateInputObjectSchema ]).optional(), _min: ScheduleMinAggregateInputObjectSchema.optional(), _max: ScheduleMaxAggregateInputObjectSchema.optional(), _avg: ScheduleAvgAggregateInputObjectSchema.optional(), _sum: ScheduleSumAggregateInputObjectSchema.optional() })