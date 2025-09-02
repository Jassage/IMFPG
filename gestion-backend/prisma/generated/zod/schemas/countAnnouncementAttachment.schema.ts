import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnnouncementAttachmentOrderByWithRelationInputObjectSchema } from './objects/AnnouncementAttachmentOrderByWithRelationInput.schema';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentCountAggregateInputObjectSchema } from './objects/AnnouncementAttachmentCountAggregateInput.schema';

export const AnnouncementAttachmentCountSchema: z.ZodType<Prisma.AnnouncementAttachmentCountArgs, z.ZodTypeDef, Prisma.AnnouncementAttachmentCountArgs> = z.object({ orderBy: z.union([AnnouncementAttachmentOrderByWithRelationInputObjectSchema, AnnouncementAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementAttachmentWhereInputObjectSchema.optional(), cursor: AnnouncementAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnnouncementAttachmentCountAggregateInputObjectSchema ]).optional() }).strict();

export const AnnouncementAttachmentCountZodSchema = z.object({ orderBy: z.union([AnnouncementAttachmentOrderByWithRelationInputObjectSchema, AnnouncementAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementAttachmentWhereInputObjectSchema.optional(), cursor: AnnouncementAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnnouncementAttachmentCountAggregateInputObjectSchema ]).optional() }).strict();