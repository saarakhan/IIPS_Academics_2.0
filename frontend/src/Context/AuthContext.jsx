import { createContext, useState, useEffect, useContext } from "react";

import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

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

  // Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error("Google OAuth error:", error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.error("Unexpected Google OAuth error:", err.message);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  // GitHub OAuth
  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });
      if (error) {
        console.error("GitHub OAuth error:", error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.error("Unexpected GitHub OAuth error:", err.message);
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
    const fetchProfileAndStore = async (userId) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Error fetching profile:", error?.message);
      }
    };

    const setupSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchProfileAndStore(session.user.id);
      }
    };
    setupSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfileAndStore(session.user.id);
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ensure user profile exists after login (including OAuth)
  useEffect(() => {
    const ensureProfile = async () => {
      if (session && session.user) {
        const user = session.user;
        // Check if profile exists
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!data && !error) {
          // Insert new profile if not found
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name:
              user.user_metadata?.full_name || user.user_metadata?.name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
          });
        }
      }
    };
    ensureProfile();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        SignInUser,
        session,
        SignOut,
        signInWithGoogle,
        signInWithGitHub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
