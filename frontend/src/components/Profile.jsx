export default function Profile({ user, onLogout }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title mb-0">Profil użytkownika</h4>
          <span className="badge text-bg-success">Zalogowano</span>
        </div>

        <table className="table table-sm table-bordered mb-4">
          <tbody>
            <tr>
              <th className="bg-light w-25">ID (UUID)</th>
              <td className="font-monospace small">{user.id}</td>
            </tr>
            <tr>
              <th className="bg-light">Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th className="bg-light">Nick</th>
              <td>{user.nickname || <span className="text-muted">—</span>}</td>
            </tr>
            <tr>
              <th className="bg-light">Imię i nazwisko</th>
              <td>
                {user.name || user.surname ? (
                  `${user.name || ""} ${user.surname || ""}`.trim()
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
            <tr>
              <th className="bg-light">Telefon</th>
              <td>{user.phone_number || <span className="text-muted">—</span>}</td>
            </tr>
            <tr>
              <th className="bg-light">Rola / Status</th>
              <td>
                <span className="badge text-bg-secondary me-2">
                  {user.user_role}
                </span>
                <span className="badge text-bg-info text-dark">
                  {user.account_status}
                </span>
              </td>
            </tr>
            <tr>
              <th className="bg-light">Utworzono</th>
              <td>{new Date(user.created_at).toLocaleString("pl-PL")}</td>
            </tr>
          </tbody>
        </table>

        <button type="button" className="btn btn-outline-danger w-100" onClick={onLogout}>
          Wyloguj się
        </button>
      </div>
    </div>
  );
}
