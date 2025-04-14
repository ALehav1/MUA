import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-500">Page not found</p>
      <Link
        to="/"
        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound; 