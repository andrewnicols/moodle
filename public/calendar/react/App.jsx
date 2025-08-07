import React from 'react';

export default function App({ welcomeMessage }) {
  return <div>{welcomeMessage || 'Hello from React!'}</div>;
}
