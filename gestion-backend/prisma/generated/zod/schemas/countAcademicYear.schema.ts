import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './objects/AcademicYearOrderByWithRelationInput.schema';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';
import { AcademicYearCountAggregateInputObjectSchema } from './objects/AcademicYearCountAggregateInput.schema';

export const AcademicYearCountSchema: z.ZodType<Prisma.AcademicYearCountArgs, z.ZodTypeDef, Prisma.AcademicYearCountArgs> = z.object({ orderBy: z.union([AcademicYearOrderByWithRelationInputObjectSchema, AcademicYearOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcademicYearWhereInputObjectSchema.optional(), cursor: AcademicYearWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcademicYearCountAggregateInputObjectSchema ]).optional() }).strict();

export const AcademicYearCountZodSchema = z.object({ orderBy: z.union([AcademicYearOrderByWithRelationInputObjectSchema, AcademicYearOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcademicYearWhereInputObjectSchema.optional(), cursor: AcademicYearWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcademicYearCountAggregateInputObjectSchema ]).optional() }).strict();