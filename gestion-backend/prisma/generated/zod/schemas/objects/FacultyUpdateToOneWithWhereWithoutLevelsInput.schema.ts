import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { FacultyUpdateWithoutLevelsInputObjectSchema } from './FacultyUpdateWithoutLevelsInput.schema';
import { FacultyUncheckedUpdateWithoutLevelsInputObjectSchema } from './FacultyUncheckedUpdateWithoutLevelsInput.schema'

export const FacultyUpdateToOneWithWhereWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyUpdateToOneWithWhereWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyUpdateToOneWithWhereWithoutLevelsInput> = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)])
}).strict();
export const FacultyUpdateToOneWithWhereWithoutLevelsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)])
}).strict();
