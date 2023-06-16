import { Request, Response, NextFunction } from 'express';

  const ErrorHandler=(err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error for debugging purposes

    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    // For any other errors, return a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
