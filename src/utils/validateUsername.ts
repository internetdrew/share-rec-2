interface UsernameValidationResponse {
  isAvailable: boolean;
}

export const validateUsername = async (
  value: string
): Promise<UsernameValidationResponse | undefined> => {
  if (value) {
    const res = await fetch(`/api/username/validate?username=${value}`);
    if (!res.ok) throw new Error('Something went wrong.');

    const data: UsernameValidationResponse = await res.json();
    return data;
  }
};
