import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateOrConnectWithoutAssignmentsInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema'

export const FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateNestedOneWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).optional()
}).strict();
export const FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).optional()
}).strict();
