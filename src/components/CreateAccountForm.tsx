import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import FormConfirmationMessage from './FormConfirmationMessage';
import toast from 'react-hot-toast';
import { getSupabaseBrowserClient } from '@/utils/supabase/components';
import { validateUsername } from '@/utils';
import { SIGNUP_FORM_FIELD_LENGTHS } from '@/constants';

interface CreateAccountFormData {
  email: string;
  displayName: string;
  username: string;
}

const createAccountSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
  displayName: z
    .string()
    .min(2, { message: 'Display names must be at least 2 characters long.' }),
  username: z
    .string()
    .min(SIGNUP_FORM_FIELD_LENGTHS.minUsernameChars, {
      message: `Your username must be at least ${SIGNUP_FORM_FIELD_LENGTHS.minUsernameChars} characters long`,
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Usernames can only contain letters, numbers, and underscores.',
    })
    .refine(
      async value => {
        return await validateUsername(value);
      },
      { message: 'This username is already taken. Please try another.' }
    ),
});

const CreateAccountForm = () => {
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
  const [accountCreationError, setAccountCreationError] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
  });

  const onConfirm: SubmitHandler<CreateAccountFormData> = async data => {
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        data: {
          displayName: data.displayName,
          username: data.username,
        },
      },
    });

    if (!error) {
      setShowConfirmationMsg(true);
    }

    if (error) {
      console.log(error);
      setAccountCreationError(true);
      switch (error.status) {
        case 429: {
          toast.error(
            'You have made too many requests. Please try again later.'
          );
          break;
        }
        default: {
          toast.error('Something went wrong...');
        }
      }
    }
  };

  useEffect(() => {
    if (!accountCreationError && isSubmitSuccessful) {
      reset();
    }
  }, [accountCreationError, isSubmitSuccessful, reset]);

  return (
    <>
      <div className='bg-slate-50 max-w-md mx-auto flex flex-col p-4 rounded-lg ring-1 ring-slate-300 shadow-2xl'>
        {showConfirmationMsg ? (
          <FormConfirmationMessage
            heading='Check your inbox...'
            message='You should have a confirmation link waiting for you.'
          />
        ) : (
          <>
            <form
              className='mt-6 flex flex-col gap-4'
              onSubmit={handleSubmit(onConfirm)}
            >
              <header className='text-xl text-center font-semibold'>
                <h1>We&apos;re excited for you to join!</h1>
              </header>
              <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email</label>
                <input
                  type='text'
                  placeholder='Enter your email address'
                  {...register('email')}
                />
                {errors.email && (
                  <small className='errorMsg'>{errors.email.message}</small>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <label>Display name</label>
                <input
                  type='text'
                  className='w-full'
                  placeholder='Ex. Nyesha Arrington'
                  {...register('displayName')}
                />
                <small className='errorMsg'>
                  {errors.displayName?.message}
                </small>
              </div>
              <div className='flex flex-col gap-1'>
                <label>Username</label>
                <input
                  type='text'
                  className='w-full'
                  placeholder='Please enter a username...'
                  {...register('username')}
                />
                <small className='errorMsg'>{errors.username?.message}</small>
              </div>
              <button className='btn-primary rounded-md'>
                Create account{' '}
              </button>
            </form>
            <p className='text-center text-sm mt-6 text-slate-700'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-cyan-700 font-medium hover:text-cyan-800'
              >
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default CreateAccountForm;
