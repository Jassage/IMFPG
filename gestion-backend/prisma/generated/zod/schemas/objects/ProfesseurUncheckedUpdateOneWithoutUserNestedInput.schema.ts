import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutUserInputObjectSchema } from './ProfesseurCreateWithoutUserInput.schema';
import { ProfesseurUncheckedCreateWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateWithoutUserInput.schema';
import { ProfesseurCreateOrConnectWithoutUserInputObjectSchema } from './ProfesseurCreateOrConnectWithoutUserInput.schema';
import { ProfesseurUpsertWithoutUserInputObjectSchema } from './ProfesseurUpsertWithoutUserInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurUpdateToOneWithWhereWithoutUserInputObjectSchema } from './ProfesseurUpdateToOneWithWhereWithoutUserInput.schema';
import { ProfesseurUpdateWithoutUserInputObjectSchema } from './ProfesseurUpdateWithoutUserInput.schema';
import { ProfesseurUncheckedUpdateWithoutUserInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutUserInput.schema'

export const ProfesseurUncheckedUpdateOneWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.ProfesseurUncheckedUpdateOneWithoutUserNestedInput, z.ZodTypeDef, Prisma.ProfesseurUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutUserInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutUserInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)]).optional()
}).strict();
export const ProfesseurUncheckedUpdateOneWithoutUserNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutUserInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutUserInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)]).optional()
}).strict();
