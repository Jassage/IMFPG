import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutAssignmentsInputObjectSchema } from './FacultyCreateWithoutAssignmentsInput.schema';
import { FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema } from './FacultyCreateOrConnectWithoutAssignmentsInput.schema';
import { FacultyUpsertWithoutAssignmentsInputObjectSchema } from './FacultyUpsertWithoutAssignmentsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema } from './FacultyUpdateToOneWithWhereWithoutAssignmentsInput.schema';
import { FacultyUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUpdateWithoutAssignmentsInput.schema';
import { FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutAssignmentsInput.schema'

export const FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema: z.ZodType<Prisma.FacultyUpdateOneRequiredWithoutAssignmentsNestedInput, z.ZodTypeDef, Prisma.FacultyUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
export const FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
