import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';

export const RoomCountSchema: z.ZodType<Prisma.RoomCountArgs, z.ZodTypeDef, Prisma.RoomCountArgs> = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional() }).strict();

export const RoomCountZodSchema = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional() }).strict();