import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutAssignmentsInput.schema'

export const FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateOrConnectWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
