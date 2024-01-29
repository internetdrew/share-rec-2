import React from 'react';

interface EditProfileModalProps {
  showModalState: boolean;
}

export const EditProfileModal = ({ showModalState }: EditProfileModalProps) => {
  return (
    <>
      {showModalState ? (
        <dialog open className='min-w-96'>
          <form className='form'>
            <header className='text-center text-xl font-semibold mb-4'>
              Edit Profile
            </header>
            <div>
              <label>Display name</label>
              <input type='text' className='w-full' />
            </div>
          </form>
        </dialog>
      ) : null}
    </>
  );
};
