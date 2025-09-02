import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './objects/ProfesseurOrderByWithRelationInput.schema';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';
import { ProfesseurCountAggregateInputObjectSchema } from './objects/ProfesseurCountAggregateInput.schema';

export const ProfesseurCountSchema: z.ZodType<Prisma.ProfesseurCountArgs, z.ZodTypeDef, Prisma.ProfesseurCountArgs> = z.object({ orderBy: z.union([ProfesseurOrderByWithRelationInputObjectSchema, ProfesseurOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProfesseurWhereInputObjectSchema.optional(), cursor: ProfesseurWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProfesseurCountAggregateInputObjectSchema ]).optional() }).strict();

export const ProfesseurCountZodSchema = z.object({ orderBy: z.union([ProfesseurOrderByWithRelationInputObjectSchema, ProfesseurOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProfesseurWhereInputObjectSchema.optional(), cursor: ProfesseurWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProfesseurCountAggregateInputObjectSchema ]).optional() }).strict();