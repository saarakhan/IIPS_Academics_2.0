import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  //signup
  // const SignUpNewUser = async(email, password) =>{
  //     const {data, error} = await supabase.auth.signUp({
  //         email: email.toLowerCase(),
  //         password
  //     });
  //     if(error){
  //         console.error("Error signing up: ", error);
  //         return { success: false, error };
  //     }
  //     return {success: true, data}
  // }

  // Sign in
  const SignInUser = async (email, password) => {
    try {
      // Try signing in first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        // If credentials are invalid, try signing up
        if (error.message === "Invalid login credentials") {
          const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
              email: email.toLowerCase(),
              password,
            });

          if (signUpError) {
            console.error("Sign-up error:", signUpError.message);
            return { success: false, error: signUpError.message };
          }

          console.log("Sign-up success:", signUpData);
          return { success: true, data: signUpData };
        } else {
          console.error("Sign-in error:", error.message);
          return { success: false, error: error.message };
        }
      }

      // Sign-in success
      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err.message);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  // Sign out
  async function SignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session); //for debug
      setSession(session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed, session:", session); // ✅ Debug
        setSession(session);
      }
    );
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ SignInUser, session, SignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
