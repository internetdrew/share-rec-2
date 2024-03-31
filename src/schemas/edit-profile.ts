import { z } from 'zod';
import { validateUsername } from '@/utils';

export const editProfileSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
  displayName: z
    .string()
    .min(2, { message: 'Display names must be at least 2 characters long.' }),
  username: z
    .string()
    .min(3, { message: 'Your username must be at least 3 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Usernames can only contain letters, numbers, and underscores',
    })
    .refine(
      async value => {
        return await validateUsername(value);
      },
      { message: 'This username is already taken. Please try another one.' }
    ),
});
