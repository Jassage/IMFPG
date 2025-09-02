import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipDocumentOrderByWithRelationInputObjectSchema } from './objects/ScholarshipDocumentOrderByWithRelationInput.schema';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentCountAggregateInputObjectSchema } from './objects/ScholarshipDocumentCountAggregateInput.schema';

export const ScholarshipDocumentCountSchema: z.ZodType<Prisma.ScholarshipDocumentCountArgs, z.ZodTypeDef, Prisma.ScholarshipDocumentCountArgs> = z.object({ orderBy: z.union([ScholarshipDocumentOrderByWithRelationInputObjectSchema, ScholarshipDocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipDocumentWhereInputObjectSchema.optional(), cursor: ScholarshipDocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipDocumentCountAggregateInputObjectSchema ]).optional() }).strict();

export const ScholarshipDocumentCountZodSchema = z.object({ orderBy: z.union([ScholarshipDocumentOrderByWithRelationInputObjectSchema, ScholarshipDocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipDocumentWhereInputObjectSchema.optional(), cursor: ScholarshipDocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipDocumentCountAggregateInputObjectSchema ]).optional() }).strict();