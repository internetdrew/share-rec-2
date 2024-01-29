import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';

interface CreateAccountFormData {
  email: string;
  displayName: string;
}

const createAccountSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
  displayName: z
    .string()
    .min(2, { message: 'Display names must be at least 2 characters long.' }),
});

const CreateAccountForm = () => {
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
  const supabase = useSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
  });

  const onConfirm: SubmitHandler<
    CreateAccountFormData
  > = async createAccountData => {
    await supabase.auth.signInWithOtp({
      email: createAccountData.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/login',
        data: {
          displayName: createAccountData.displayName,
        },
      },
    });
    setShowConfirmationMsg(true);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <Head>
        <title>Sign up for Let&apos;s Share Recipes</title>
      </Head>
      <div className='bg-slate-50 max-w-md mx-auto flex flex-col p-4 rounded-lg ring-1 ring-slate-800 shadow-2xl'>
        {showConfirmationMsg ? (
          <>
            <p className='text-lg text-center font-semibold'>
              You&apos;re almost there...
            </p>
            <p className='text-center'>
              Please check your inbox to confirm your email address.
            </p>
          </>
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
                <label htmlFor='email' className='text-sm font-medium'>
                  Display name:
                </label>
                <input
                  type='text'
                  placeholder='Ex. Bobby Filet'
                  {...register('displayName')}
                />
                {errors.displayName && (
                  <small className='text-red-700'>
                    {errors.displayName.message}
                  </small>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email:
                </label>
                <input
                  type='text'
                  placeholder='Enter your email address'
                  {...register('email')}
                />
                {errors.email && (
                  <small className='text-red-700'>{errors.email.message}</small>
                )}
              </div>
              <button className='btn-primary rounded-md'>
                Create my account
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
