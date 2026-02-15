// src/Components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes (handles session restore on mobile)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return session ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
