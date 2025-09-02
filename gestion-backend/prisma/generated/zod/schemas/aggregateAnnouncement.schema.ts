import { z } from 'zod';
import { AnnouncementOrderByWithRelationInputObjectSchema } from './objects/AnnouncementOrderByWithRelationInput.schema';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';
import { AnnouncementCountAggregateInputObjectSchema } from './objects/AnnouncementCountAggregateInput.schema';
import { AnnouncementMinAggregateInputObjectSchema } from './objects/AnnouncementMinAggregateInput.schema';
import { AnnouncementMaxAggregateInputObjectSchema } from './objects/AnnouncementMaxAggregateInput.schema';

export const AnnouncementAggregateSchema = z.object({ orderBy: z.union([AnnouncementOrderByWithRelationInputObjectSchema, AnnouncementOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementWhereInputObjectSchema.optional(), cursor: AnnouncementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AnnouncementCountAggregateInputObjectSchema ]).optional(), _min: AnnouncementMinAggregateInputObjectSchema.optional(), _max: AnnouncementMaxAggregateInputObjectSchema.optional() })