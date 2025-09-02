import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateOrConnectWithoutAssignmentsInput.schema';
import { FacultyLevelUpsertWithoutAssignmentsInputObjectSchema } from './FacultyLevelUpsertWithoutAssignmentsInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema } from './FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInput.schema';
import { FacultyLevelUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUpdateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedUpdateWithoutAssignmentsInput.schema'

export const FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateOneWithoutAssignmentsNestedInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateOneWithoutAssignmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyLevelUpsertWithoutAssignmentsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
export const FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyLevelCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyLevelUpsertWithoutAssignmentsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => FacultyLevelWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
