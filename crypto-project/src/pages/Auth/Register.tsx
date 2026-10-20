import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { ErrorModal } from '../../components';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Enter a password');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <ErrorModal message={error} onClose={() => setError('')} />
      <div className="bg-bg rounded-lg shadow-lg p-8 w-full max-w-md border border-line">
        <h1 className="text-3xl font-bold text-fg text-center mb-2">Create Account</h1>
  
 
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <label htmlFor="email" className="block text-fg-muted font-medium text-sm">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-line bg-bg text-fg rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-fg-subtle disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-fg-muted font-medium text-sm">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-line bg-bg text-fg rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-fg-subtle disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-fg-muted font-medium text-sm">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              minLength={6}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-line bg-bg text-fg rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-fg-subtle disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent-hover text-accent-fg font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-fg-muted text-sm mt-6">
          Already have an account? <Link to="/login" className="text-accent hover:text-accent-hover font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
