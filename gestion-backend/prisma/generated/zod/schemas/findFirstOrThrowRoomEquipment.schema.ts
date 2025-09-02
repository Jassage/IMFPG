import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomEquipmentIncludeObjectSchema } from './objects/RoomEquipmentInclude.schema';
import { RoomEquipmentOrderByWithRelationInputObjectSchema } from './objects/RoomEquipmentOrderByWithRelationInput.schema';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentScalarFieldEnumSchema } from './enums/RoomEquipmentScalarFieldEnum.schema';
import { RoomArgsObjectSchema } from './objects/RoomArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RoomEquipmentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.RoomEquipmentSelect, z.ZodTypeDef, Prisma.RoomEquipmentSelect> = z.object({
    id: z.boolean().optional(),
    roomId: z.boolean().optional(),
    room: z.boolean().optional(),
    name: z.boolean().optional()
  }).strict();

export const RoomEquipmentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    roomId: z.boolean().optional(),
    room: z.boolean().optional(),
    name: z.boolean().optional()
  }).strict();

export const RoomEquipmentFindFirstOrThrowSchema: z.ZodType<Prisma.RoomEquipmentFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.RoomEquipmentFindFirstOrThrowArgs> = z.object({ select: RoomEquipmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => RoomEquipmentIncludeObjectSchema.optional()), orderBy: z.union([RoomEquipmentOrderByWithRelationInputObjectSchema, RoomEquipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomEquipmentWhereInputObjectSchema.optional(), cursor: RoomEquipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomEquipmentScalarFieldEnumSchema, RoomEquipmentScalarFieldEnumSchema.array()]).optional() }).strict();

export const RoomEquipmentFindFirstOrThrowZodSchema = z.object({ select: RoomEquipmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => RoomEquipmentIncludeObjectSchema.optional()), orderBy: z.union([RoomEquipmentOrderByWithRelationInputObjectSchema, RoomEquipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomEquipmentWhereInputObjectSchema.optional(), cursor: RoomEquipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomEquipmentScalarFieldEnumSchema, RoomEquipmentScalarFieldEnumSchema.array()]).optional() }).strict();