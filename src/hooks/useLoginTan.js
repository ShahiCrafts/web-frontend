import { useMutation } from "@tanstack/react-query";
import { loginUserService, logoutUserService } from "../services/authService";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { roleRoutes } from "../utils/roleRoutes";

const useLoginTan = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ["Login"],
    onSuccess: (data) => {
      console.log("Login success:", data);

      const { user, token } = data;

      signIn(user, token);

      const route = roleRoutes[user?.role];
      navigate(route);
    },
    onError: (err) => {
      console.log(err.message)
    },
  });
};

export const useLogoutTan = () => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUserService,
    mutationKey: ["Logout"],

    onSuccess: (data) => {
      console.log("Logout success:", data.message);
      
      signOut();
      
      navigate('/login');
    },

    onError: (err) => {
      console.error("Logout failed:", err.message);
    },
  });
};

export default useLoginTan;
