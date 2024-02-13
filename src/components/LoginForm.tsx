import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import Head from 'next/head';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
}

const signupSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email to login.' })
    .min(5, { message: 'Email address seems a bit...short..?' }),
});

const LoginForm = () => {
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
  const supabase = useSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LoginFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLogin: SubmitHandler<LoginFormData> = async loginData => {
    const { error } = await supabase.auth.signInWithOtp({
      email: loginData.email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      toast.error('You need to sign up before you can login.');
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
        <title>Login to Let&apos;s Share Recipes</title>
      </Head>
      <div className='bg-slate-50 mt-20 max-w-md mx-auto flex flex-col p-4 rounded-lg ring-1 ring-slate-800 shadow-2xl'>
        {!showConfirmationMsg ? (
          <>
            <p className='text-lg text-center font-semibold'>
              You&apos;re almost there...
            </p>
            <p className='text-center'>
              Please check your inbox for your login link.
            </p>
          </>
        ) : (
          <>
            <form
              className='mt-6 flex flex-col gap-4'
              onSubmit={handleSubmit(onLogin)}
            >
              <header className='text-xl text-center font-semibold'>
                Let&apos;s get you logged in...
              </header>
              <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email:</label>
                <input
                  type='text'
                  placeholder='Enter your email address'
                  {...register('email')}
                />
                {errors.email && (
                  <small className='text-red-700'>{errors.email.message}</small>
                )}
              </div>
              <button className='btn-primary rounded-md'>Login</button>
            </form>
            <p className='text-center text-sm mt-6 text-slate-700'>
              Don&apos;t have an account yet?{' '}
              <Link
                href={'/'}
                className='text-cyan-700 font-medium hover:text-cyan-800'
              >
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default LoginForm;
