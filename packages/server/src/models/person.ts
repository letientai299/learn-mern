import { z } from 'zod';
import { ObjectId } from 'mongodb';

const schema = z.object({
  _id: z.union([
    z.string().optional().default(''),
    z.custom<ObjectId>((v) => typeof v === 'string' && ObjectId.isValid(v)),
  ]),
  name: z.string().min(1).max(10),
  age: z.number().int().positive().max(100),
  createAt: z.date(),
});

const inputSchema = schema.omit({
  _id: true,
  createAt: true,
});

export type Person = z.infer<typeof schema>;
export type PersonInput = z.infer<typeof inputSchema>;

export default {
  Schema: schema,
  Input: inputSchema,
};
