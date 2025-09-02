import { z } from 'zod';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';
import { AnnouncementAttachmentOrderByWithAggregationInputObjectSchema } from './objects/AnnouncementAttachmentOrderByWithAggregationInput.schema';
import { AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema } from './objects/AnnouncementAttachmentScalarWhereWithAggregatesInput.schema';
import { AnnouncementAttachmentScalarFieldEnumSchema } from './enums/AnnouncementAttachmentScalarFieldEnum.schema';
import { AnnouncementAttachmentCountAggregateInputObjectSchema } from './objects/AnnouncementAttachmentCountAggregateInput.schema';
import { AnnouncementAttachmentMinAggregateInputObjectSchema } from './objects/AnnouncementAttachmentMinAggregateInput.schema';
import { AnnouncementAttachmentMaxAggregateInputObjectSchema } from './objects/AnnouncementAttachmentMaxAggregateInput.schema';

export const AnnouncementAttachmentGroupBySchema = z.object({ where: AnnouncementAttachmentWhereInputObjectSchema.optional(), orderBy: z.union([AnnouncementAttachmentOrderByWithAggregationInputObjectSchema, AnnouncementAttachmentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AnnouncementAttachmentScalarFieldEnumSchema), _count: z.union([ z.literal(true), AnnouncementAttachmentCountAggregateInputObjectSchema ]).optional(), _min: AnnouncementAttachmentMinAggregateInputObjectSchema.optional(), _max: AnnouncementAttachmentMaxAggregateInputObjectSchema.optional() })