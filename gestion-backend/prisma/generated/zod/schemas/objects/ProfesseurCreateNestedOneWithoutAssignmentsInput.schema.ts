import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateWithoutAssignmentsInput.schema';
import { ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema } from './ProfesseurUncheckedCreateWithoutAssignmentsInput.schema';
import { ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateOrConnectWithoutAssignmentsInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema'

export const ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateNestedOneWithoutAssignmentsInput, z.ZodTypeDef, Prisma.ProfesseurCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateNestedOneWithoutAssignmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
