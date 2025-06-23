import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // No specific mfaChallenge state needed here if OtpVerificationPage handles its own transient state for the token

  // Fetch and set user profile
  const fetchAndStoreUserProfile = async (userId) => {
    setLoadingProfile(true);
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, email, course, semester, role, first_name, last_name, avatar_url"
      )
      .eq("id", userId)
      .single();
    if (data && !error) {
      setProfile(data);
      localStorage.setItem("userProfile", JSON.stringify(data));
    } else {
      setProfile(null);
      console.error("Failed to fetch profile:", error?.message);
    }
    setLoadingProfile(false);
  };

  
  const refreshUserProfile = () => {
    if (session?.user?.id) fetchAndStoreUserProfile(session.user.id);
  };

  const SignInUser = async (email, password) => {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
       
        
        console.error("Sign-in error:", error.message);
        return { success: false, error: error.message };
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

  
  const SignUpNewUser = async (email, password, fullName) => {
    setLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: fullName,
           
          },
        },
      });
      if (error) throw error;
     
      console.log("Sign-up initiated, confirmation email sent (if enabled):", data);
      return { success: true, data }; // data contains user object, session might be null
    } catch (err) {
      console.error("Error signing up new user:", err);
      return { success: false, error: err.message || "Sign up failed." };
    } finally {
     
    }
  };

  // Sign out
  async function SignOut() {
    localStorage.removeItem("userProfile");
    setProfile(null); // Clear local profile state on sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  useEffect(() => {
    setLoadingAuth(true); 
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        if (initialSession?.user?.id) {
          fetchAndStoreUserProfile(initialSession.user.id);
        } else {
          setProfile(null);
        }
        setLoadingAuth(false);
      })
      .catch(() => {
        setLoadingAuth(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user?.id) {
          fetchAndStoreUserProfile(currentSession.user.id);
        } else {
          setProfile(null);
          localStorage.removeItem("userProfile");
        }
        setLoadingAuth(false);
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const verifySignupOtp = async (email, token) => {
    setLoadingAuth(true); 
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'signup', 
        email: email,
        token: token,
      });
      if (error) throw error;
      console.log("Signup OTP verification successful, session should be established:", data);
      // After OTP verification, create profile if it doesn't exist
      const user = data.user;
      if (user) {
        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!existingProfile) {
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
          let first_name = "";
          let last_name = "";
          if (fullName) {
            const nameParts = fullName.trim().split(" ");
            first_name = nameParts[0];
            last_name = nameParts.slice(1).join(" ");
          }
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email?.toLowerCase(),
              first_name,
              last_name,
              avatar_url: user.user_metadata?.avatar_url || "",
              role: "user",
            });
          if (insertError) {
            console.error("Error creating profile after OTP verification:", insertError);
          } else {
            await fetchAndStoreUserProfile(user.id);
          }
        }
      }
      return { success: true, data };
    } catch (err) {
      console.error("Error verifying signup OTP:", err);
      setLoadingAuth(false); 
      return { success: false, error: err.message || "OTP verification failed." };
    }
  };

  const resendSignupOtp = async (email) => {
    try {
     
      const { data, error } = await supabase.auth.resend({
        type: 'signup', 
        email: email,
      });
      if (error) throw error;
      console.log("Resend signup OTP request successful:", data);
      return { success: true, message: "A new OTP has been sent to your email." };
    } catch (err) {
      console.error("Error resending signup OTP:", err);
      return { success: false, error: err.message || "Failed to resend OTP." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        SignInUser,
        session,
        profile,
        loadingProfile,
        loadingAuth,
        refreshUserProfile,
        SignOut,
        signInWithGoogle,
        signInWithGitHub,
        SignUpNewUser,      // Added new signup function
        verifySignupOtp,
        resendSignupOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
