import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Helper to fetch and store profile
  const fetchAndStoreUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "email, course, semester, role, first_name, last_name, avatar_url"
      )
      .eq("id", userId)
      .single();

    if (data && !error) {
      localStorage.setItem("userProfile", JSON.stringify(data));
    } else {
      console.error("Failed to fetch profile:", error?.message);
    }
  };

  // Sign in
  const SignInUser = async (email, password) => {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
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
          if (signUpData.user?.id) {
            await fetchAndStoreUserProfile(signUpData.user.id);
          }
          return { success: true, data: signUpData };
        } else {
          console.error("Sign-in error:", error.message);
          return { success: false, error: error.message };
        }
      }

      console.log("Sign-in success:", data);
      if (data.user?.id) {
        await fetchAndStoreUserProfile(data.user.id);
      }
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err.message);
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  // OAuth Google
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

  // OAuth GitHub
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
    localStorage.removeItem("userProfile"); // Remove profile on logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchAndStoreUserProfile(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.id) {
          fetchAndStoreUserProfile(session.user.id);
        } else {
          localStorage.removeItem("userProfile");
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  // Ensure user profile exists after login (including OAuth)
  useEffect(() => {
    const ensureProfile = async () => {
      if (session?.user) {
        const user = session.user;
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!data && !error) {
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
