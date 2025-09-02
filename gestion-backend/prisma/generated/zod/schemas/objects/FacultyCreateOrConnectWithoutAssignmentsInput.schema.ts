import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyCreateWithoutAssignmentsInputObjectSchema } from './FacultyCreateWithoutAssignmentsInput.schema';
import { FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutAssignmentsInput.schema'

export const FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateOrConnectWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const FacultyCreateOrConnectWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
