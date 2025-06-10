import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loadingAuth, setLoadingAuth] = useState(true); 

  
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

          }
          return { success: true, data: signUpData }; // signUpData contains the new session
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
    localStorage.removeItem("userProfile"); 
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    
  }

  useEffect(() => {
    setLoadingAuth(true); // Set loading true at the start
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user?.id) {
        fetchAndStoreUserProfile(initialSession.user.id);
      }
      setLoadingAuth(false); 
    }).catch(() => {
      setLoadingAuth(false); 
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user?.id) {
          fetchAndStoreUserProfile(currentSession.user.id);
        } else {
          localStorage.removeItem("userProfile");
        }
        setLoadingAuth(false); 
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  
  useEffect(() => {
    const ensureProfile = async () => {
      if (session?.user) {
        const user = session.user;
        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("id, role") 
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code !== 'PGRST116') { 
            console.error("Error checking for profile:", selectError);
            return;
        }
        
        if (!existingProfile) { // Profile does not exist, create it
          console.log(`AuthContext: Profile for ${user.id} not found, creating one.`);
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email?.toLowerCase(),
            full_name:
              user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            role: 'user', 
          });
          if (insertError) {
            console.error("Error creating profile:", insertError);
          } else {
            
            await fetchAndStoreUserProfile(user.id);
          }
        } else if (existingProfile && !existingProfile.role) { 
            console.log(`AuthContext: Profile for ${user.id} exists but missing role, updating.`);
            const { error: updateRoleError } = await supabase
                .from("profiles")
                .update({ role: 'user' })
                .eq("id", user.id);
            if (updateRoleError) {
                console.error("Error updating profile role:", updateRoleError);
            } else {
                await fetchAndStoreUserProfile(user.id); 
            }
        }
      }
    };
    
    if (session && !loadingAuth) { 
        ensureProfile();
    }
  }, [session, loadingAuth]); 

  return (
    <AuthContext.Provider
      value={{
        SignInUser,
        session,
        loadingAuth, // Provide loadingAuth
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
