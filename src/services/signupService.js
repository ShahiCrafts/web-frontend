import {
  createAccountService,
} from "./authService";

export const signupService = async (signupData) => {
  const { email, password, fullName, role } = signupData;

  try {
    await createAccountService({ email, password, fullName, role });
  } catch (error) {
    throw error;
  }
};