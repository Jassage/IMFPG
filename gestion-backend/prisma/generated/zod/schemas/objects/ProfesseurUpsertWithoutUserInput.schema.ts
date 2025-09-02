import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurUpdateWithoutUserInputObjectSchema } from './ProfesseurUpdateWithoutUserInput.schema';
import { ProfesseurUncheckedUpdateWithoutUserInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutUserInput.schema';
import { ProfesseurCreateWithoutUserInputObjectSchema } from './ProfesseurCreateWithoutUserInput.schema';
import { ProfesseurUncheckedCreateWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateWithoutUserInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurUpsertWithoutUserInputObjectSchema: z.ZodType<Prisma.ProfesseurUpsertWithoutUserInput, z.ZodTypeDef, Prisma.ProfesseurUpsertWithoutUserInput> = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
export const ProfesseurUpsertWithoutUserInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
