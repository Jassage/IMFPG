import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutUserInputObjectSchema } from './StudentCreateWithoutUserInput.schema';
import { StudentUncheckedCreateWithoutUserInputObjectSchema } from './StudentUncheckedCreateWithoutUserInput.schema';
import { StudentCreateOrConnectWithoutUserInputObjectSchema } from './StudentCreateOrConnectWithoutUserInput.schema';
import { StudentUpsertWithoutUserInputObjectSchema } from './StudentUpsertWithoutUserInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutUserInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutUserInput.schema';
import { StudentUpdateWithoutUserInputObjectSchema } from './StudentUpdateWithoutUserInput.schema';
import { StudentUncheckedUpdateWithoutUserInputObjectSchema } from './StudentUncheckedUpdateWithoutUserInput.schema'

export const StudentUpdateOneWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneWithoutUserNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutUserInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutUserInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutUserInputObjectSchema), z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneWithoutUserNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutUserInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutUserInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutUserInputObjectSchema), z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)]).optional()
}).strict();
