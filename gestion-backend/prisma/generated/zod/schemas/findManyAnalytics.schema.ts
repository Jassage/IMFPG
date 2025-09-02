import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnalyticsOrderByWithRelationInputObjectSchema } from './objects/AnalyticsOrderByWithRelationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';
import { AnalyticsScalarFieldEnumSchema } from './enums/AnalyticsScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AnalyticsFindManySelectSchema: z.ZodType<Prisma.AnalyticsSelect, z.ZodTypeDef, Prisma.AnalyticsSelect> = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    data: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    parameters: z.boolean().optional()
  }).strict();

export const AnalyticsFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    data: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    parameters: z.boolean().optional()
  }).strict();

export const AnalyticsFindManySchema: z.ZodType<Prisma.AnalyticsFindManyArgs, z.ZodTypeDef, Prisma.AnalyticsFindManyArgs> = z.object({ select: AnalyticsFindManySelectSchema.optional(),  orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnalyticsScalarFieldEnumSchema, AnalyticsScalarFieldEnumSchema.array()]).optional() }).strict();

export const AnalyticsFindManyZodSchema = z.object({ select: AnalyticsFindManySelectSchema.optional(),  orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnalyticsScalarFieldEnumSchema, AnalyticsScalarFieldEnumSchema.array()]).optional() }).strict();