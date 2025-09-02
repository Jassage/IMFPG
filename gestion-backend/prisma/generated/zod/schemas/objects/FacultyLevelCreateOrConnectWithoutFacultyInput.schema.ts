import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelCreateWithoutFacultyInputObjectSchema } from './FacultyLevelCreateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutFacultyInput.schema'

export const FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateOrConnectWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelCreateOrConnectWithoutFacultyInput> = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const FacultyLevelCreateOrConnectWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
