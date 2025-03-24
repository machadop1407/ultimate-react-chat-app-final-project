import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";

enum AuthType {
  Login = "login",
  SignUp = "signup",
}

interface AuthFormData {
  email: string;
  password: string;
}

function Auth() {
  const [authType, setAuthType] = useState<AuthType>(AuthType.SignUp);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setAuthErrorMessage(null);

    if (authType === AuthType.Login) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) setAuthErrorMessage(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setAuthErrorMessage(error.message);
      } else {
        alert("Sign up successful! Please check your email for confirmation.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2> {authType === AuthType.Login ? "Login" : "Sign Up"} </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label> Email: </label>
        <input
          type="email"
          {...register("email", { required: "Email is required." })}
        />
        {errors.email && <p className="error-text"> {errors.email.message}</p>}

        <label> Password: </label>
        <input
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        {errors.password && (
          <p className="error-text"> {errors.password.message}</p>
        )}

        {authErrorMessage && <p className="error-text"> {authErrorMessage}</p>}

        <button type="submit">
          {authType === AuthType.Login ? "Login" : "Sign Up"}{" "}
        </button>
      </form>

      <div>
        {authType === AuthType.Login ? (
          <p>
            {" "}
            Don't have an account?{" "}
            <button onClick={() => setAuthType(AuthType.SignUp)}>
              {" "}
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            {" "}
            Already have an account?{" "}
            <button onClick={() => setAuthType(AuthType.Login)}> Login</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
