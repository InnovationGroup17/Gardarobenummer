import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

export const useAuthListener = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Set up the real-time listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Return the cleanup function
    return () => unsubscribe();
  }, [auth]);

  return user;
};
