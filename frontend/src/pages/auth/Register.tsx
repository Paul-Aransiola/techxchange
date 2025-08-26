import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { registerSchema } from '../../utils/validationSchemas';
import { ROLES } from '../../types';
import { register } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Radio, Space, Typography } from 'antd';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<ROLES>(ROLES.BUYER);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await register(registerData, role);
      login(response);
      navigate(role === ROLES.SELLER ? '/seller/dashboard' : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Create an Account
        </Title>
        
        <Radio.Group 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="mb-6"
        >
          <Space direction="horizontal">
            <Radio value={ROLES.BUYER}>I'm a Buyer</Radio>
            <Radio value={ROLES.SELLER}>I'm a Seller</Radio>
          </Space>
        </Radio.Group>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name
                </label>
                <Field
                  name="firstName"
                  type="text"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-1">
                  Last Name
                </label>
                <Field
                  name="lastName"
                  type="text"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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
                <label htmlFor="phoneNumber" className="block mb-1">
                  Phone Number (e.g., +1234567890)
                </label>
                <Field
                  name="phoneNumber"
                  type="tel"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="phoneNumber"
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

              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;