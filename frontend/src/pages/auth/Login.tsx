import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../utils/validationSchemas";
import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "antd";
import { LoginInput, ROLES } from "../../types";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginInput) => {
    try {
      const { token, user } = await login(values);       

      await authLogin({ token, user });

      const redirectPath = user.role === ROLES.SELLER ? '/seller/dashboard' : '/';
      navigate(redirectPath, { replace: true });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Login to Your Account
        </Title>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="w-full"
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
