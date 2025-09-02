import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { FacultyOrderByWithRelationInputObjectSchema } from './objects/FacultyOrderByWithRelationInput.schema';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './objects/FacultyWhereUniqueInput.schema';
import { FacultyCountAggregateInputObjectSchema } from './objects/FacultyCountAggregateInput.schema';

export const FacultyCountSchema: z.ZodType<Prisma.FacultyCountArgs, z.ZodTypeDef, Prisma.FacultyCountArgs> = z.object({ orderBy: z.union([FacultyOrderByWithRelationInputObjectSchema, FacultyOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyWhereInputObjectSchema.optional(), cursor: FacultyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FacultyCountAggregateInputObjectSchema ]).optional() }).strict();

export const FacultyCountZodSchema = z.object({ orderBy: z.union([FacultyOrderByWithRelationInputObjectSchema, FacultyOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyWhereInputObjectSchema.optional(), cursor: FacultyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FacultyCountAggregateInputObjectSchema ]).optional() }).strict();