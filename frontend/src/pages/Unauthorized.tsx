// pages/UnauthorizedPage.tsx
import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Title level={1} className="text-red-500">
        403 - Unauthorized
      </Title>
      <p className="text-lg mb-4">
        You don't have permission to access this page.
      </p>
      <Button type="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
};

export default UnauthorizedPage;