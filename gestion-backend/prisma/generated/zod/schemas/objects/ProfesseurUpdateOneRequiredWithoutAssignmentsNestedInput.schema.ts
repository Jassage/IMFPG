import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedCreateWithoutAssignmentsInput.schema';
import { ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateOrConnectWithoutAssignmentsInput.schema';
import { ProfesseurUpsertWithoutAssignmentsInputObjectSchema } from './ProfesseurUpsertWithoutAssignmentsInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema } from './ProfesseurUpdateToOneWithWhereWithoutAssignmentsInput.schema';
import { ProfesseurUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUpdateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutAssignmentsInput.schema'

export const ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInput, z.ZodTypeDef, Prisma.ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
export const ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
