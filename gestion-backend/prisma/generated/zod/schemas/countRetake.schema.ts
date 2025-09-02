import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RetakeOrderByWithRelationInputObjectSchema } from './objects/RetakeOrderByWithRelationInput.schema';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';
import { RetakeCountAggregateInputObjectSchema } from './objects/RetakeCountAggregateInput.schema';

export const RetakeCountSchema: z.ZodType<Prisma.RetakeCountArgs, z.ZodTypeDef, Prisma.RetakeCountArgs> = z.object({ orderBy: z.union([RetakeOrderByWithRelationInputObjectSchema, RetakeOrderByWithRelationInputObjectSchema.array()]).optional(), where: RetakeWhereInputObjectSchema.optional(), cursor: RetakeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RetakeCountAggregateInputObjectSchema ]).optional() }).strict();

export const RetakeCountZodSchema = z.object({ orderBy: z.union([RetakeOrderByWithRelationInputObjectSchema, RetakeOrderByWithRelationInputObjectSchema.array()]).optional(), where: RetakeWhereInputObjectSchema.optional(), cursor: RetakeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RetakeCountAggregateInputObjectSchema ]).optional() }).strict();