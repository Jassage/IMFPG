import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutLevelsInputObjectSchema } from './FacultyCreateWithoutLevelsInput.schema';
import { FacultyUncheckedCreateWithoutLevelsInputObjectSchema } from './FacultyUncheckedCreateWithoutLevelsInput.schema';
import { FacultyCreateOrConnectWithoutLevelsInputObjectSchema } from './FacultyCreateOrConnectWithoutLevelsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema'

export const FacultyCreateNestedOneWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyCreateNestedOneWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyCreateNestedOneWithoutLevelsInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutLevelsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
export const FacultyCreateNestedOneWithoutLevelsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutLevelsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
