import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUpdateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutAssignmentsInput.schema'

export const ProfesseurUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateToOneWithWhereWithoutAssignmentsInput, z.ZodTypeDef, Prisma.ProfesseurUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const ProfesseurUpdateToOneWithWhereWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
