import { FC, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import { tesloAPI } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";
import axios from "axios";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    if (!Cookies.get("token")) return;

    try {
      const { data } = await tesloAPI.get("/user/validate-token");
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "Auth - Login", payload: user });
    } catch (error) {
      console.log(error);
      Cookies.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloAPI.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);

      dispatch({ type: "Auth - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloAPI.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);

      dispatch({ type: "Auth - Login", payload: user });
      return {
        hasError: false,
        message: "",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string };
        return {
          hasError: true,
          message,
        };
      }

      return {
        hasError: true,
        message:
          "Something went wrong when trying to register, please try again later",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        /* Methods */
        loginUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};