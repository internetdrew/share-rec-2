import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect } from 'react';

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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LoginFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLogin: SubmitHandler<LoginFormData> = async loginData => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: loginData.email,
      options: {
        shouldCreateUser: false,
      },
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className='bg-white mt-20 max-w-md mx-auto flex flex-col p-4 rounded-lg ring-1 ring-black shadow-2xl'>
      <form
        className='mt-6 flex flex-col gap-4'
        onSubmit={handleSubmit(onLogin)}
      >
        <header className='text-xl text-center font-semibold'>
          Let&apos;s get you logged in...
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
        <button className='btn-primary rounded-md'>Login</button>
      </form>
      <p className='text-center text-sm mt-6 text-slate-700'>
        Don&apos;t have an account yet?{' '}
        <span>
          <Link
            href={'/sign-up'}
            className='text-cyan-700 font-medium hover:text-cyan-800'
          >
            Sign up
          </Link>
        </span>
      </p>
    </div>
  );
};

export default LoginForm;