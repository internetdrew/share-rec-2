import React, { useEffect, useRef } from 'react';
import { Tables } from '@/types/supabase';

type UserProfile = Tables<'profiles'>;

export const EditProfileModal = ({
  profileData,
}: {
  profileData: UserProfile | undefined;
}) => {
  const dialogEl = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    !profileData && dialogEl.current?.showModal();
  }, [profileData]);

  return (
    <dialog ref={dialogEl} className='form max-w-sm'>
      <form>
        <header className='text-xl font-semibold mb-1'>
          {profileData ? 'Edit' : 'Complete'} Profile
        </header>
        <span className='text-slate-600'>
          {profileData
            ? 'Provide details about yourself so others can easily identify you in shared spaces.'
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
          <div className='bg-red-200 h-20 w-20 rounded-full mr-4'></div>
        </section>
        <section className='flex flex-col gap-4 mt-4'>
          <div className='flex flex-col gap-1'>
            <label>Username</label>
            <input
              autoFocus={!profileData}
              type='text'
              className='w-full'
              placeholder='Please enter a username...'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label>Display name</label>
            <input
              type='text'
              className='w-full'
              placeholder='Ex. Nyesha Arrington'
            />
          </div>
        </section>
        <button autoFocus className='btn-primary w-full mt-4'>
          Save
        </button>
      </form>
    </dialog>
  );
};
