export function SettingsPage() {
  return (
    <div className="stack">
      <section className="card">
        <div className="section-header">
          <div>
            <p className="eyebrow">System Settings</p>
            <h2>Operational checklist</h2>
          </div>
        </div>
        <ul className="settings-list">
          <li>Configure environment variables and admin seed user.</li>
          <li>Attach Firebase Cloud Messaging service credentials.</li>
          <li>Set production CORS origins and HTTPS termination.</li>
          <li>Enable persistent object storage for assets and avatars.</li>
        </ul>
      </section>
    </div>
  );
}
