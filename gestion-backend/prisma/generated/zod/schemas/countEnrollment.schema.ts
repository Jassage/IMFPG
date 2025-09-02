import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EnrollmentOrderByWithRelationInputObjectSchema } from './objects/EnrollmentOrderByWithRelationInput.schema';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';
import { EnrollmentCountAggregateInputObjectSchema } from './objects/EnrollmentCountAggregateInput.schema';

export const EnrollmentCountSchema: z.ZodType<Prisma.EnrollmentCountArgs, z.ZodTypeDef, Prisma.EnrollmentCountArgs> = z.object({ orderBy: z.union([EnrollmentOrderByWithRelationInputObjectSchema, EnrollmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: EnrollmentWhereInputObjectSchema.optional(), cursor: EnrollmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EnrollmentCountAggregateInputObjectSchema ]).optional() }).strict();

export const EnrollmentCountZodSchema = z.object({ orderBy: z.union([EnrollmentOrderByWithRelationInputObjectSchema, EnrollmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: EnrollmentWhereInputObjectSchema.optional(), cursor: EnrollmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EnrollmentCountAggregateInputObjectSchema ]).optional() }).strict();