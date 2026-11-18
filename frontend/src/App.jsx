import { useEffect, useState } from "react";
import { fetchCurrentUser } from "./api/auth";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";

const TOKEN_STORAGE_KEY = "isi_access_token";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetchCurrentUser(token)
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
          setSessionError("");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setSessionError(
          err.status === 401
            ? "Sesja wygasła. Zaloguj się ponownie."
            : "Nie udało się połączyć z API (sprawdź czy backend działa na porcie 8000)."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleLoginSuccess(newToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setSessionError("");
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setSessionError("");
  }

  const loadingProfile = Boolean(token) && user === null;

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: "540px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">System Rekomendacji Gier</h2>
          <p className="text-muted mb-0">Panel logowania i rejestracji (ISI)</p>
        </div>

        {sessionError && (
          <div className="alert alert-warning py-2">{sessionError}</div>
        )}

        {loadingProfile ? (
          <div className="card shadow-sm p-4 text-center">
            <div className="spinner-border text-primary mx-auto mb-2" role="status" />
            <div className="text-muted">Ładowanie profilu...</div>
          </div>
        ) : user ? (
          <Profile user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}
