import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnnouncementOrderByWithRelationInputObjectSchema } from './objects/AnnouncementOrderByWithRelationInput.schema';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';
import { AnnouncementCountAggregateInputObjectSchema } from './objects/AnnouncementCountAggregateInput.schema';

export const AnnouncementCountSchema: z.ZodType<Prisma.AnnouncementCountArgs, z.ZodTypeDef, Prisma.AnnouncementCountArgs> = z.object({ orderBy: z.union([AnnouncementOrderByWithRelationInputObjectSchema, AnnouncementOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementWhereInputObjectSchema.optional(), cursor: AnnouncementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnnouncementCountAggregateInputObjectSchema ]).optional() }).strict();

export const AnnouncementCountZodSchema = z.object({ orderBy: z.union([AnnouncementOrderByWithRelationInputObjectSchema, AnnouncementOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementWhereInputObjectSchema.optional(), cursor: AnnouncementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnnouncementCountAggregateInputObjectSchema ]).optional() }).strict();