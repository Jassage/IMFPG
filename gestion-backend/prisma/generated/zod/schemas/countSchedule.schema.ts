import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScheduleOrderByWithRelationInputObjectSchema } from './objects/ScheduleOrderByWithRelationInput.schema';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';
import { ScheduleCountAggregateInputObjectSchema } from './objects/ScheduleCountAggregateInput.schema';

export const ScheduleCountSchema: z.ZodType<Prisma.ScheduleCountArgs, z.ZodTypeDef, Prisma.ScheduleCountArgs> = z.object({ orderBy: z.union([ScheduleOrderByWithRelationInputObjectSchema, ScheduleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScheduleWhereInputObjectSchema.optional(), cursor: ScheduleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScheduleCountAggregateInputObjectSchema ]).optional() }).strict();

export const ScheduleCountZodSchema = z.object({ orderBy: z.union([ScheduleOrderByWithRelationInputObjectSchema, ScheduleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScheduleWhereInputObjectSchema.optional(), cursor: ScheduleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScheduleCountAggregateInputObjectSchema ]).optional() }).strict();