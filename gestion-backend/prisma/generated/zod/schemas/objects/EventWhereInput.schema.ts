import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { EventParticipantListRelationFilterObjectSchema } from './EventParticipantListRelationFilter.schema'

export const EventWhereInputObjectSchema: z.ZodType<Prisma.EventWhereInput, z.ZodTypeDef, Prisma.EventWhereInput> = z.object({
  AND: z.union([z.lazy(() => EventWhereInputObjectSchema), z.lazy(() => EventWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventWhereInputObjectSchema), z.lazy(() => EventWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  startDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  organizer: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isPublic: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  participants: z.lazy(() => EventParticipantListRelationFilterObjectSchema).optional()
}).strict();
export const EventWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EventWhereInputObjectSchema), z.lazy(() => EventWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventWhereInputObjectSchema), z.lazy(() => EventWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  startDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  organizer: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isPublic: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  participants: z.lazy(() => EventParticipantListRelationFilterObjectSchema).optional()
}).strict();
