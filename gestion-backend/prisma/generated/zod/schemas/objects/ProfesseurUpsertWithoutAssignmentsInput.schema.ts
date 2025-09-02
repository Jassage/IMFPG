import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUpdateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutAssignmentsInput.schema';
import { ProfesseurCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedCreateWithoutAssignmentsInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurUpsertWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.ProfesseurUpsertWithoutAssignmentsInput, z.ZodTypeDef, Prisma.ProfesseurUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
export const ProfesseurUpsertWithoutAssignmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
