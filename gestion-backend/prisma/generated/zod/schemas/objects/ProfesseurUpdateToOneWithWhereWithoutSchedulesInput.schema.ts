import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUpdateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutSchedulesInput.schema'

export const ProfesseurUpdateToOneWithWhereWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateToOneWithWhereWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurUpdateToOneWithWhereWithoutSchedulesInput> = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)])
}).strict();
export const ProfesseurUpdateToOneWithWhereWithoutSchedulesInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)])
}).strict();
