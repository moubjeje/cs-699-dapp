import LoginButton from '../components/LoginButton';

function Login({ onLogin }) {
  return (
    <div className="Login">
      <LoginButton onLogin={onLogin} />
    </div>
  );
}

export default Login;