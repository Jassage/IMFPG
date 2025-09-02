import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyUpdateWithoutLevelsInputObjectSchema } from './FacultyUpdateWithoutLevelsInput.schema';
import { FacultyUncheckedUpdateWithoutLevelsInputObjectSchema } from './FacultyUncheckedUpdateWithoutLevelsInput.schema';
import { FacultyCreateWithoutLevelsInputObjectSchema } from './FacultyCreateWithoutLevelsInput.schema';
import { FacultyUncheckedCreateWithoutLevelsInputObjectSchema } from './FacultyUncheckedCreateWithoutLevelsInput.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema'

export const FacultyUpsertWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyUpsertWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyUpsertWithoutLevelsInput> = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
export const FacultyUpsertWithoutLevelsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
