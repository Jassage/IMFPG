import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelScalarWhereInputObjectSchema } from './FacultyLevelScalarWhereInput.schema';
import { FacultyLevelUpdateManyMutationInputObjectSchema } from './FacultyLevelUpdateManyMutationInput.schema';
import { FacultyLevelUncheckedUpdateManyWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedUpdateManyWithoutFacultyInput.schema'

export const FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateManyWithWhereWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateManyWithWhereWithoutFacultyInput> = z.object({
  where: z.lazy(() => FacultyLevelScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => FacultyLevelUpdateManyMutationInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
export const FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => FacultyLevelUpdateManyMutationInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
