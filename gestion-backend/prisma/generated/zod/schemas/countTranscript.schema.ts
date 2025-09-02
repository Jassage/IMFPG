import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { TranscriptOrderByWithRelationInputObjectSchema } from './objects/TranscriptOrderByWithRelationInput.schema';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';
import { TranscriptCountAggregateInputObjectSchema } from './objects/TranscriptCountAggregateInput.schema';

export const TranscriptCountSchema: z.ZodType<Prisma.TranscriptCountArgs, z.ZodTypeDef, Prisma.TranscriptCountArgs> = z.object({ orderBy: z.union([TranscriptOrderByWithRelationInputObjectSchema, TranscriptOrderByWithRelationInputObjectSchema.array()]).optional(), where: TranscriptWhereInputObjectSchema.optional(), cursor: TranscriptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TranscriptCountAggregateInputObjectSchema ]).optional() }).strict();

export const TranscriptCountZodSchema = z.object({ orderBy: z.union([TranscriptOrderByWithRelationInputObjectSchema, TranscriptOrderByWithRelationInputObjectSchema.array()]).optional(), where: TranscriptWhereInputObjectSchema.optional(), cursor: TranscriptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TranscriptCountAggregateInputObjectSchema ]).optional() }).strict();