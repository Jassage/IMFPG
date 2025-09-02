import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema'

export const RoomScalarRelationFilterObjectSchema: z.ZodType<Prisma.RoomScalarRelationFilter, z.ZodTypeDef, Prisma.RoomScalarRelationFilter> = z.object({
  is: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
export const RoomScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
