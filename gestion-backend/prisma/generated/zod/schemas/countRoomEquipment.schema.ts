import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomEquipmentOrderByWithRelationInputObjectSchema } from './objects/RoomEquipmentOrderByWithRelationInput.schema';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentCountAggregateInputObjectSchema } from './objects/RoomEquipmentCountAggregateInput.schema';

export const RoomEquipmentCountSchema: z.ZodType<Prisma.RoomEquipmentCountArgs, z.ZodTypeDef, Prisma.RoomEquipmentCountArgs> = z.object({ orderBy: z.union([RoomEquipmentOrderByWithRelationInputObjectSchema, RoomEquipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomEquipmentWhereInputObjectSchema.optional(), cursor: RoomEquipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomEquipmentCountAggregateInputObjectSchema ]).optional() }).strict();

export const RoomEquipmentCountZodSchema = z.object({ orderBy: z.union([RoomEquipmentOrderByWithRelationInputObjectSchema, RoomEquipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomEquipmentWhereInputObjectSchema.optional(), cursor: RoomEquipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RoomEquipmentCountAggregateInputObjectSchema ]).optional() }).strict();