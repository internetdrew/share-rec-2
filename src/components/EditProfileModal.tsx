import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { editProfileSchema } from '@/schemas';

type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

interface EditProfileModalProps {
  profileData: UserProfile | undefined;
  email: string;
  displayName: string;
  username: string;
}

interface EditProfileFormData {
  email: string;
  displayName: string;
  username: string;
  avatar: string;
}

export const EditProfileModal = (props: EditProfileModalProps) => {
  const { profileData, email, displayName, username } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email,
      displayName,
      username,
    },
  });

  const dialogEl = useRef<HTMLDialogElement>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: avatarRef, ...restOfAvatarRegister } = register('avatar');

  const createProfile = useMutation({
    mutationFn: (userData: EditProfileFormData) => {
      return fetch('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
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
              <button className='text-xs btn-secondary'>Change</button>
              <button className='text-xs btn-secondary'>Remove</button>
            </div>
          </div>
          <div className='bg-slate-200 ring-1 ring-slate-800 h-16 w-16 rounded-full mr-4 overflow-hidden flex items-center justify-center'>
            {profileData?.avatarUrl ? (
              <Image src={profileData?.avatarUrl} alt='profile image' />
            ) : (
              <FaUser className='w-1/2 h-1/2' />
            )}
          </div>
          <input
            {...restOfAvatarRegister}
            type='file'
            name='avatar'
            className='sr-only'
            ref={e => {
              avatarRef(e);
              avatarInputRef.current = e;
            }}
          />
        </section>
        <section className='flex flex-col gap-4 mt-6'>
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
