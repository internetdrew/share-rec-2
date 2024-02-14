import React, { useEffect, useRef } from 'react';
import { Tables } from '@/types/supabase';
import { z } from 'zod';
import { FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'lodash.debounce';
import { useMutation } from '@tanstack/react-query';

interface EditProfileModalProps {
  profileData: UserProfile | undefined;
  email: string;
}

interface EditProfileFormData {
  email: string;
  displayName: string;
  username: string;
}

const validateUsername = debounce(async value => {
  if (value) {
    const res = await fetch(`/api/username/validate?username=${value}`);
    if (!res.ok) throw new Error('Something went wrong.');

    const data = await res.json();
    const isUsernameAvailable = data.isAvailable;
    return isUsernameAvailable;
  }
}, 300);

const editProfileSchema = z.object({
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
      { message: 'This username is already taken.' }
    ),
});

type UserProfile = Tables<'profiles'>;

export const EditProfileModal = ({
  profileData,
  email,
}: EditProfileModalProps) => {
  const dialogEl = useRef<HTMLDialogElement>(null);
  const createProfile = useMutation({
    mutationFn: (userData: EditProfileFormData) => {
      return fetch('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email,
    },
  });

  const onSubmit: SubmitHandler<EditProfileFormData> = data => {
    createProfile.mutateAsync(data);
  };

  useEffect(() => {
    if (!profileData) {
      dialogEl.current?.showModal();
    } else {
      dialogEl.current?.close();
    }
  }, [profileData]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <dialog ref={dialogEl} className='form max-w-sm'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='text-xl font-semibold mb-1'>
          {profileData ? 'Edit' : 'Complete'} your profile
        </header>
        <span className='text-slate-600'>
          {profileData
            ? 'Provide details so others can easily identify you in shared spaces.'
            : 'To complete your profile, please choose a username.'}
        </span>
        <hr className='my-2' />
        <p className='font-semibold text-lg mb-2'>Basic Information</p>
        <section className='flex justify-between items-center'>
          <div>
            <p className='text-sm'>Profile photo</p>
            <small className='text-slate-600'>Recommended 300 x 300</small>
            <div className='flex items-center gap-2 mt-2'>
              <button className='tiny-btn'>Change</button>
              <button className='tiny-btn'>Remove</button>
            </div>
          </div>
          <div className='bg-slate-200 ring-1 ring-slate-800 h-16 w-16 rounded-full mr-4 overflow-hidden flex items-center justify-center'>
            {profileData?.avatar_url ? (
              <Image src={profileData?.avatar_url} alt='profile image' />
            ) : (
              <FaUser className='w-1/2 h-1/2' />
            )}
          </div>
        </section>
        <section className='flex flex-col gap-4 mt-4'>
          <div className='flex flex-col gap-1'>
            <label>Email</label>
            <input
              type='text'
              className='w-full'
              placeholder='Ex. Nyesha Arrington'
              {...register('email')}
            />
            <small className='text-red-600'>{errors.email?.message}</small>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Display name</label>
            <input
              type='text'
              className='w-full'
              placeholder='Ex. Nyesha Arrington'
              {...register('displayName')}
            />
            <small className='text-red-600'>
              {errors.displayName?.message}
            </small>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Username</label>
            <input
              autoFocus={!profileData}
              type='text'
              className='w-full'
              placeholder='Please enter a username...'
              {...register('username')}
            />
            <small className='text-red-600'>{errors.username?.message}</small>
          </div>
        </section>
        <button autoFocus className='btn-primary w-full mt-4'>
          Save
        </button>
      </form>
    </dialog>
  );
};
