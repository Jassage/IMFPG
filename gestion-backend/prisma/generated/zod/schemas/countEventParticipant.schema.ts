import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EventParticipantOrderByWithRelationInputObjectSchema } from './objects/EventParticipantOrderByWithRelationInput.schema';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';
import { EventParticipantCountAggregateInputObjectSchema } from './objects/EventParticipantCountAggregateInput.schema';

export const EventParticipantCountSchema: z.ZodType<Prisma.EventParticipantCountArgs, z.ZodTypeDef, Prisma.EventParticipantCountArgs> = z.object({ orderBy: z.union([EventParticipantOrderByWithRelationInputObjectSchema, EventParticipantOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventParticipantWhereInputObjectSchema.optional(), cursor: EventParticipantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EventParticipantCountAggregateInputObjectSchema ]).optional() }).strict();

export const EventParticipantCountZodSchema = z.object({ orderBy: z.union([EventParticipantOrderByWithRelationInputObjectSchema, EventParticipantOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventParticipantWhereInputObjectSchema.optional(), cursor: EventParticipantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EventParticipantCountAggregateInputObjectSchema ]).optional() }).strict();