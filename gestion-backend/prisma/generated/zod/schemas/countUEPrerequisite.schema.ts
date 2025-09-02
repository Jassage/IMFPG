import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { UEPrerequisiteOrderByWithRelationInputObjectSchema } from './objects/UEPrerequisiteOrderByWithRelationInput.schema';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteCountAggregateInputObjectSchema } from './objects/UEPrerequisiteCountAggregateInput.schema';

export const UEPrerequisiteCountSchema: z.ZodType<Prisma.UEPrerequisiteCountArgs, z.ZodTypeDef, Prisma.UEPrerequisiteCountArgs> = z.object({ orderBy: z.union([UEPrerequisiteOrderByWithRelationInputObjectSchema, UEPrerequisiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEPrerequisiteWhereInputObjectSchema.optional(), cursor: UEPrerequisiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UEPrerequisiteCountAggregateInputObjectSchema ]).optional() }).strict();

export const UEPrerequisiteCountZodSchema = z.object({ orderBy: z.union([UEPrerequisiteOrderByWithRelationInputObjectSchema, UEPrerequisiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEPrerequisiteWhereInputObjectSchema.optional(), cursor: UEPrerequisiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UEPrerequisiteCountAggregateInputObjectSchema ]).optional() }).strict();