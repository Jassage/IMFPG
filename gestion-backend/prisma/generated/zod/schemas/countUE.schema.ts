import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { UEOrderByWithRelationInputObjectSchema } from './objects/UEOrderByWithRelationInput.schema';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';
import { UEWhereUniqueInputObjectSchema } from './objects/UEWhereUniqueInput.schema';
import { UECountAggregateInputObjectSchema } from './objects/UECountAggregateInput.schema';

export const UECountSchema: z.ZodType<Prisma.UECountArgs, z.ZodTypeDef, Prisma.UECountArgs> = z.object({ orderBy: z.union([UEOrderByWithRelationInputObjectSchema, UEOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEWhereInputObjectSchema.optional(), cursor: UEWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UECountAggregateInputObjectSchema ]).optional() }).strict();

export const UECountZodSchema = z.object({ orderBy: z.union([UEOrderByWithRelationInputObjectSchema, UEOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEWhereInputObjectSchema.optional(), cursor: UEWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UECountAggregateInputObjectSchema ]).optional() }).strict();