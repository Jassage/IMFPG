import { z } from 'zod';
export const BookAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    title: z.number(),
    author: z.number(),
    isbn: z.number(),
    category: z.number(),
    faculty: z.number(),
    quantity: z.number(),
    available: z.number(),
    location: z.number(),
    status: z.number(),
    bookLoans: z.number()
  }).optional(),
  _sum: z.object({
    quantity: z.number().nullable(),
    available: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    quantity: z.number().nullable(),
    available: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    author: z.string().nullable(),
    isbn: z.string().nullable(),
    category: z.string().nullable(),
    faculty: z.string().nullable(),
    quantity: z.number().int().nullable(),
    available: z.number().int().nullable(),
    location: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    author: z.string().nullable(),
    isbn: z.string().nullable(),
    category: z.string().nullable(),
    faculty: z.string().nullable(),
    quantity: z.number().int().nullable(),
    available: z.number().int().nullable(),
    location: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional()});