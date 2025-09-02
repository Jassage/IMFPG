import { z } from 'zod';
import { AnnouncementAttachmentOrderByWithRelationInputObjectSchema } from './objects/AnnouncementAttachmentOrderByWithRelationInput.schema';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentCountAggregateInputObjectSchema } from './objects/AnnouncementAttachmentCountAggregateInput.schema';
import { AnnouncementAttachmentMinAggregateInputObjectSchema } from './objects/AnnouncementAttachmentMinAggregateInput.schema';
import { AnnouncementAttachmentMaxAggregateInputObjectSchema } from './objects/AnnouncementAttachmentMaxAggregateInput.schema';

export const AnnouncementAttachmentAggregateSchema = z.object({ orderBy: z.union([AnnouncementAttachmentOrderByWithRelationInputObjectSchema, AnnouncementAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementAttachmentWhereInputObjectSchema.optional(), cursor: AnnouncementAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AnnouncementAttachmentCountAggregateInputObjectSchema ]).optional(), _min: AnnouncementAttachmentMinAggregateInputObjectSchema.optional(), _max: AnnouncementAttachmentMaxAggregateInputObjectSchema.optional() })