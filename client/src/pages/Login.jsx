import React from 'react';
import AuthForm from '../components/AuthForm';

const Login = ({ onLogin }) => {
  return <AuthForm isLogin={true} />;
};

export default Login;