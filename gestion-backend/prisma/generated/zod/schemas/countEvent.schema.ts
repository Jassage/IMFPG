import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EventOrderByWithRelationInputObjectSchema } from './objects/EventOrderByWithRelationInput.schema';
import { EventWhereInputObjectSchema } from './objects/EventWhereInput.schema';
import { EventWhereUniqueInputObjectSchema } from './objects/EventWhereUniqueInput.schema';
import { EventCountAggregateInputObjectSchema } from './objects/EventCountAggregateInput.schema';

export const EventCountSchema: z.ZodType<Prisma.EventCountArgs, z.ZodTypeDef, Prisma.EventCountArgs> = z.object({ orderBy: z.union([EventOrderByWithRelationInputObjectSchema, EventOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventWhereInputObjectSchema.optional(), cursor: EventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EventCountAggregateInputObjectSchema ]).optional() }).strict();

export const EventCountZodSchema = z.object({ orderBy: z.union([EventOrderByWithRelationInputObjectSchema, EventOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventWhereInputObjectSchema.optional(), cursor: EventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EventCountAggregateInputObjectSchema ]).optional() }).strict();