import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnalyticsOrderByWithRelationInputObjectSchema } from './objects/AnalyticsOrderByWithRelationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';
import { AnalyticsScalarFieldEnumSchema } from './enums/AnalyticsScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AnalyticsFindFirstSelectSchema: z.ZodType<Prisma.AnalyticsSelect, z.ZodTypeDef, Prisma.AnalyticsSelect> = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    data: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    parameters: z.boolean().optional()
  }).strict();

export const AnalyticsFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    data: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    parameters: z.boolean().optional()
  }).strict();

export const AnalyticsFindFirstSchema: z.ZodType<Prisma.AnalyticsFindFirstArgs, z.ZodTypeDef, Prisma.AnalyticsFindFirstArgs> = z.object({ select: AnalyticsFindFirstSelectSchema.optional(),  orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnalyticsScalarFieldEnumSchema, AnalyticsScalarFieldEnumSchema.array()]).optional() }).strict();

export const AnalyticsFindFirstZodSchema = z.object({ select: AnalyticsFindFirstSelectSchema.optional(),  orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnalyticsScalarFieldEnumSchema, AnalyticsScalarFieldEnumSchema.array()]).optional() }).strict();