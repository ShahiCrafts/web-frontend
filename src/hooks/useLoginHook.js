import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authService";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const useLoginTan = () => {
  const { signIn } = useContext(AuthContext);

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ["Login"],
    onSuccess: (data) => {
      console.log("Login success:", data);
      console.log({email: data.user?.email, fullName: data.user?.fullName} );
      signIn(data.user, data.token);
      console.log('Login Successful!')
      console.log('Returned login data:', data);
    },
    onError: (err) => {
      console.log(err.message)
    },
  });
};

export default useLoginTan;
