import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomIncludeObjectSchema } from './objects/RoomInclude.schema';
import { RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomScalarFieldEnumSchema } from './enums/RoomScalarFieldEnum.schema';
import { RoomEquipmentArgsObjectSchema } from './objects/RoomEquipmentArgs.schema';
import { RoomReservationArgsObjectSchema } from './objects/RoomReservationArgs.schema';
import { RoomCountOutputTypeArgsObjectSchema } from './objects/RoomCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RoomFindFirstOrThrowSelectSchema: z.ZodType<Prisma.RoomSelect, z.ZodTypeDef, Prisma.RoomSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    capacity: z.boolean().optional(),
    equipment: z.boolean().optional(),
    location: z.boolean().optional(),
    status: z.boolean().optional(),
    reservations: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const RoomFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    capacity: z.boolean().optional(),
    equipment: z.boolean().optional(),
    location: z.boolean().optional(),
    status: z.boolean().optional(),
    reservations: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const RoomFindFirstOrThrowSchema: z.ZodType<Prisma.RoomFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.RoomFindFirstOrThrowArgs> = z.object({ select: RoomFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => RoomIncludeObjectSchema.optional()), orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array()]).optional() }).strict();

export const RoomFindFirstOrThrowZodSchema = z.object({ select: RoomFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => RoomIncludeObjectSchema.optional()), orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array()]).optional() }).strict();