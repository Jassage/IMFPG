import { z } from 'zod';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';
import { AnnouncementOrderByWithAggregationInputObjectSchema } from './objects/AnnouncementOrderByWithAggregationInput.schema';
import { AnnouncementScalarWhereWithAggregatesInputObjectSchema } from './objects/AnnouncementScalarWhereWithAggregatesInput.schema';
import { AnnouncementScalarFieldEnumSchema } from './enums/AnnouncementScalarFieldEnum.schema';
import { AnnouncementCountAggregateInputObjectSchema } from './objects/AnnouncementCountAggregateInput.schema';
import { AnnouncementMinAggregateInputObjectSchema } from './objects/AnnouncementMinAggregateInput.schema';
import { AnnouncementMaxAggregateInputObjectSchema } from './objects/AnnouncementMaxAggregateInput.schema';

export const AnnouncementGroupBySchema = z.object({ where: AnnouncementWhereInputObjectSchema.optional(), orderBy: z.union([AnnouncementOrderByWithAggregationInputObjectSchema, AnnouncementOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AnnouncementScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AnnouncementScalarFieldEnumSchema), _count: z.union([ z.literal(true), AnnouncementCountAggregateInputObjectSchema ]).optional(), _min: AnnouncementMinAggregateInputObjectSchema.optional(), _max: AnnouncementMaxAggregateInputObjectSchema.optional() })