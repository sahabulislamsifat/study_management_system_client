import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "../hooks/axiosInstance"; // Axios instance with interceptors

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student account create
  const createUser = async (user) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      await updateUserProfile(user);

      await saveUser(user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // SignIn with Email and Password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  // SignIn With Google
  const googleSignIn = new GoogleAuthProvider();
  const continueWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleSignIn);
      await saveUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  // Forget Password
  const forgetPassword = async (email) => {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending reset email:", error.message);
    }
  };

  // Log Out
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // save user
  const saveUser = async (currentUser) => {
    console.log("save user:", currentUser.displayName);

    const userData = {
      name: currentUser?.displayName, // Default name
      image: currentUser?.photoURL, // Default image
      email: currentUser?.email,
      role: currentUser.userRole,
    };

    console.log(currentUser);

    console.log(userData);

    const result = await axios.post(`/users`, userData);
    const token = result.data?.token;
    localStorage.setItem("Token", token);
    setUser((prev) => ({ ...prev, ...result.data?.user }));
  };

  // onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("Token");
        const result = await axios.get(`/verify-token/${token}`);
        if (currentUser?.email && (result.data.isValid || !token)) {
          setUser((prev) => ({ ...prev, ...result.data.user, ...currentUser }));
        } else {
          logOut();
        }
      } catch (error) {
        console.error("Error during onAuthStateChanged:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  // Update User Profile
  const updateUserProfile = async (obj) => {
    try {
      return await updateProfile(auth.currentUser, obj);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const authInfo = {
    auth,
    user,
    setUser,
    loading,
    createUser,
    signIn,
    continueWithGoogle,
    updateUserProfile,
    forgetPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
