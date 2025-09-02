import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { CourseAssignmentOrderByWithRelationInputObjectSchema } from './objects/CourseAssignmentOrderByWithRelationInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCountAggregateInputObjectSchema } from './objects/CourseAssignmentCountAggregateInput.schema';

export const CourseAssignmentCountSchema: z.ZodType<Prisma.CourseAssignmentCountArgs, z.ZodTypeDef, Prisma.CourseAssignmentCountArgs> = z.object({ orderBy: z.union([CourseAssignmentOrderByWithRelationInputObjectSchema, CourseAssignmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseAssignmentWhereInputObjectSchema.optional(), cursor: CourseAssignmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CourseAssignmentCountAggregateInputObjectSchema ]).optional() }).strict();

export const CourseAssignmentCountZodSchema = z.object({ orderBy: z.union([CourseAssignmentOrderByWithRelationInputObjectSchema, CourseAssignmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseAssignmentWhereInputObjectSchema.optional(), cursor: CourseAssignmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CourseAssignmentCountAggregateInputObjectSchema ]).optional() }).strict();