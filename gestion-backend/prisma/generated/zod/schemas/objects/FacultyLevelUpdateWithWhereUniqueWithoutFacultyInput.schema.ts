import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelUpdateWithoutFacultyInputObjectSchema } from './FacultyLevelUpdateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedUpdateWithoutFacultyInput.schema'

export const FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => FacultyLevelUpdateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
export const FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => FacultyLevelUpdateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
