import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { GuardianOrderByWithRelationInputObjectSchema } from './objects/GuardianOrderByWithRelationInput.schema';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';
import { GuardianCountAggregateInputObjectSchema } from './objects/GuardianCountAggregateInput.schema';

export const GuardianCountSchema: z.ZodType<Prisma.GuardianCountArgs, z.ZodTypeDef, Prisma.GuardianCountArgs> = z.object({ orderBy: z.union([GuardianOrderByWithRelationInputObjectSchema, GuardianOrderByWithRelationInputObjectSchema.array()]).optional(), where: GuardianWhereInputObjectSchema.optional(), cursor: GuardianWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), GuardianCountAggregateInputObjectSchema ]).optional() }).strict();

export const GuardianCountZodSchema = z.object({ orderBy: z.union([GuardianOrderByWithRelationInputObjectSchema, GuardianOrderByWithRelationInputObjectSchema.array()]).optional(), where: GuardianWhereInputObjectSchema.optional(), cursor: GuardianWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), GuardianCountAggregateInputObjectSchema ]).optional() }).strict();