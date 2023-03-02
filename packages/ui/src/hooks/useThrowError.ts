import { useState } from 'react';

// ErrorBoundary does not catch errors inside async functions and event handlers
// So we're using this hook to lift the error up to outside async/event contexts
// so ErrorBoundary can catch it
// Ref: https://reactjs.org/docs/error-boundaries.html
export default function useThrowError() {
  const [error, throwError] = useState<Error>();

  if (error) {
    throw error;
  }

  return throwError;
}
