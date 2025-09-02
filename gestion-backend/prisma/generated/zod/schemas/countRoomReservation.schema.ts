import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomReservationOrderByWithRelationInputObjectSchema } from './objects/RoomReservationOrderByWithRelationInput.schema';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';
import { RoomReservationCountAggregateInputObjectSchema } from './objects/RoomReservationCountAggregateInput.schema';

export const RoomReservationCountSchema: z.ZodType<Prisma.RoomReservationCountArgs, z.ZodTypeDef, Prisma.RoomReservationCountArgs> = z.object({ orderBy: z.union([RoomReservationOrderByWithRelationInputObjectSchema, RoomReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomReservationWhereInputObjectSchema.optional(), cursor: RoomReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomReservationCountAggregateInputObjectSchema ]).optional() }).strict();

export const RoomReservationCountZodSchema = z.object({ orderBy: z.union([RoomReservationOrderByWithRelationInputObjectSchema, RoomReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomReservationWhereInputObjectSchema.optional(), cursor: RoomReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomReservationCountAggregateInputObjectSchema ]).optional() }).strict();