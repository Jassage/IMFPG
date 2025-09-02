import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedCreateWithoutAssignmentsInput.schema'

export const ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateOrConnectWithoutAssignmentsInput, z.ZodTypeDef, Prisma.ProfesseurCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const ProfesseurCreateOrConnectWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
