import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import FormConfirmationMessage from './FormConfirmationMessage';
import toast from 'react-hot-toast';
import { getSupabaseBrowserClient } from '@/utils/supabase/components';

interface CreateAccountFormData {
  email: string;
}

const createAccountSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
  // displayName: z
  //   .string()
  //   .min(2, { message: 'Display names must be at least 2 characters long.' }),
});

const CreateAccountForm = () => {
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
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
    });

    if (!error) {
      setShowConfirmationMsg(true);
    }

    if (error) {
      const errorStatus = error.status;
      switch (errorStatus) {
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
                  <small className='text-red-700'>{errors.email.message}</small>
                )}
              </div>
              <button className='btn-primary rounded-md'>
                Confirm my email address
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
