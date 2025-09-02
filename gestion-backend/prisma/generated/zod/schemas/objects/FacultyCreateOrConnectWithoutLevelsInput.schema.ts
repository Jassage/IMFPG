import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyCreateWithoutLevelsInputObjectSchema } from './FacultyCreateWithoutLevelsInput.schema';
import { FacultyUncheckedCreateWithoutLevelsInputObjectSchema } from './FacultyUncheckedCreateWithoutLevelsInput.schema'

export const FacultyCreateOrConnectWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyCreateOrConnectWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyCreateOrConnectWithoutLevelsInput> = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)])
}).strict();
export const FacultyCreateOrConnectWithoutLevelsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)])
}).strict();
