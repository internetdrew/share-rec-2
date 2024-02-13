import React from 'react';

interface FormConfirmationMessageProps {
  heading: string;
  message: string;
}

const FormConfirmationMessage = ({
  heading,
  message,
}: FormConfirmationMessageProps) => {
  return (
    <>
      <p className='text-lg text-center font-semibold'>{heading}</p>
      <p className='text-center'>{message}</p>
    </>
  );
};

export default FormConfirmationMessage;
