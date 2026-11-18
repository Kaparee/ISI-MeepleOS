import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";

const INITIAL_FORM = {
  credential: "",
  email: "",
  password: "",
  nickname: "",
  name: "",
  surname: "",
  phone_number: "",
};

export default function AuthForm({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser(form.credential, form.password);
        onLoginSuccess(data.access_token);
      } else {
        await registerUser(form);
        const loginData = await loginUser(form.email, form.password);
        onLoginSuccess(loginData.access_token);
      }
    } catch (err) {
      setError(err.message || "Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white pt-3 pb-0 border-bottom-0">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${isLogin ? "active fw-semibold" : ""}`}
              onClick={() => switchMode("login")}
            >
              Logowanie
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${!isLogin ? "active fw-semibold" : ""}`}
              onClick={() => switchMode("register")}
            >
              Rejestracja
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body p-4">
        <h4 className="card-title mb-3">
          {isLogin ? "Zaloguj się" : "Załóż konto"}
        </h4>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <div className="mb-3">
              <label className="form-label">Email lub nick</label>
              <input
                type="text"
                name="credential"
                className="form-control"
                value={form.credential}
                onChange={handleChange}
                placeholder="np. jan@example.com lub janek"
                required
              />
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jan@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nick (opcjonalnie)</label>
                <input
                  type="text"
                  name="nickname"
                  maxLength={20}
                  className="form-control"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="np. planszowkarz"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Imię</label>
                  <input
                    type="text"
                    name="name"
                    maxLength={50}
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nazwisko</label>
                  <input
                    type="text"
                    name="surname"
                    maxLength={50}
                    className="form-control"
                    value={form.surname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Telefon (opcjonalnie)</label>
                <input
                  type="text"
                  name="phone_number"
                  maxLength={50}
                  className="form-control"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="form-label">
              Hasło {!isLogin && "(min. 6 znaków) *"}
            </label>
            <input
              type="password"
              name="password"
              minLength={isLogin ? 1 : 6}
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Przetwarzanie..."
              : isLogin
              ? "Zaloguj się"
              : "Zarejestruj i zaloguj"}
          </button>
        </form>
      </div>
    </div>
  );
}
