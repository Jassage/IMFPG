import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutLevelsInputObjectSchema } from './FacultyCreateWithoutLevelsInput.schema';
import { FacultyUncheckedCreateWithoutLevelsInputObjectSchema } from './FacultyUncheckedCreateWithoutLevelsInput.schema';
import { FacultyCreateOrConnectWithoutLevelsInputObjectSchema } from './FacultyCreateOrConnectWithoutLevelsInput.schema';
import { FacultyUpsertWithoutLevelsInputObjectSchema } from './FacultyUpsertWithoutLevelsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyUpdateToOneWithWhereWithoutLevelsInputObjectSchema } from './FacultyUpdateToOneWithWhereWithoutLevelsInput.schema';
import { FacultyUpdateWithoutLevelsInputObjectSchema } from './FacultyUpdateWithoutLevelsInput.schema';
import { FacultyUncheckedUpdateWithoutLevelsInputObjectSchema } from './FacultyUncheckedUpdateWithoutLevelsInput.schema'

export const FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema: z.ZodType<Prisma.FacultyUpdateOneRequiredWithoutLevelsNestedInput, z.ZodTypeDef, Prisma.FacultyUpdateOneRequiredWithoutLevelsNestedInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutLevelsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutLevelsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)]).optional()
}).strict();
export const FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutLevelsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutLevelsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutLevelsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutLevelsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutLevelsInputObjectSchema)]).optional()
}).strict();
