import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelUpdateWithoutFacultyInputObjectSchema } from './FacultyLevelUpdateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedUpdateWithoutFacultyInput.schema';
import { FacultyLevelCreateWithoutFacultyInputObjectSchema } from './FacultyLevelCreateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutFacultyInput.schema'

export const FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpsertWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUpsertWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => FacultyLevelUpdateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => FacultyLevelUpdateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
