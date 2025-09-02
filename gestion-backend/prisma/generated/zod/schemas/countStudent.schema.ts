import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { StudentOrderByWithRelationInputObjectSchema } from './objects/StudentOrderByWithRelationInput.schema';
import { StudentWhereInputObjectSchema } from './objects/StudentWhereInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';
import { StudentCountAggregateInputObjectSchema } from './objects/StudentCountAggregateInput.schema';

export const StudentCountSchema: z.ZodType<Prisma.StudentCountArgs, z.ZodTypeDef, Prisma.StudentCountArgs> = z.object({ orderBy: z.union([StudentOrderByWithRelationInputObjectSchema, StudentOrderByWithRelationInputObjectSchema.array()]).optional(), where: StudentWhereInputObjectSchema.optional(), cursor: StudentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), StudentCountAggregateInputObjectSchema ]).optional() }).strict();

export const StudentCountZodSchema = z.object({ orderBy: z.union([StudentOrderByWithRelationInputObjectSchema, StudentOrderByWithRelationInputObjectSchema.array()]).optional(), where: StudentWhereInputObjectSchema.optional(), cursor: StudentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), StudentCountAggregateInputObjectSchema ]).optional() }).strict();