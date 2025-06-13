import { useMutation } from '@tanstack/react-query';
import { createAccountService } from '../services/authService';

const useSignupTan = () => {
  return useMutation({
    mutationFn: createAccountService,
    mutationKey: ['Signup'],
    onSuccess: (data) => {
      console.log('Signup success:', data);
    },
    onError: (err) => {
      console.error(err.message || 'Signup failed');
    },
  });
};

export default useSignupTan;
