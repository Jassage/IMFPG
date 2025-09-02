import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutAssignmentsInputObjectSchema } from './FacultyCreateWithoutAssignmentsInput.schema';
import { FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema } from './FacultyCreateOrConnectWithoutAssignmentsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema'

export const FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateNestedOneWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
export const FacultyCreateNestedOneWithoutAssignmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
