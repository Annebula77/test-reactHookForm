import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Некорректный email' }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен быть длиннее 8 символов' })
    .regex(/[A-Z]/, {
      message: 'Пароль должен содержать хотя бы одну заглавную букву',
    })
    .regex(/[a-z]/, {
      message: 'Пароль должен содержать хотя бы одну строчную букву',
    })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
    .regex(/^(?!.*[<>]).*$/, {
      message: 'Пароль не должен содержать символы < или >',
    }),
});

export type LoginModel = z.infer<typeof loginSchema>;
