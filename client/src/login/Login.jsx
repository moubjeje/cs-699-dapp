import LoginButton from '../components/LoginButton';

function Login({ handleLogin }) {
  return (
    <div className="Login">
      <LoginButton handleLogin={handleLogin} />
    </div>
  );
}

export default Login;