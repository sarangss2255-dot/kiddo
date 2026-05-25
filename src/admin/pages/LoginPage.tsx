import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('admin@kiddo.local');
  const [password, setPassword] = useState('admin12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(identifier, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to sign in. Check credentials or backend availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-hero">
          <ShieldCheck size={28} />
          <h1>KidDo Admin</h1>
          <p>Monitor platform health, moderation, engagement, and growth.</p>
        </div>

        <label>
          Email
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        </label>

        <label>
          Password
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
