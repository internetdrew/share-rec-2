import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import Head from 'next/head';

interface ConfirmEmailData {
  email: string;
}

const signupSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
});

const SignUpForm = () => {
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ConfirmEmailData>({
    resolver: zodResolver(signupSchema),
  });

  const onConfirm: SubmitHandler<ConfirmEmailData> = async loginData => {
    await supabase.auth.signInWithOtp({
      email: loginData.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/login',
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
      <div className='bg-slate-50 mt-20 max-w-md mx-auto flex flex-col p-4 rounded-lg ring-1 ring-slate-800 shadow-2xl'>
        {showConfirmationMsg ? (
          <>
            <p className='text-lg text-center font-semibold'>
              You&apos;re almost there...
            </p>
            <p className='text-center'>
              Please check your inbox on this device to confirm your email
              address.
            </p>
          </>
        ) : (
          <>
            <form
              className='mt-6 flex flex-col gap-4'
              onSubmit={handleSubmit(onConfirm)}
            >
              <header className='text-xl text-center font-semibold'>
                <h1>Let&apos;s confirm your email address...</h1>
              </header>
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
                Confirm email address
              </button>
            </form>
            <p className='text-center text-sm mt-6 text-slate-700'>
              Already have an account?{' '}
              <span>
                <Link
                  href={'/login'}
                  className='text-cyan-700 font-medium hover:text-cyan-800'
                >
                  Login
                </Link>
              </span>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default SignUpForm;
