import { Request, Response, NextFunction } from 'express';

  const errorHnadler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error(err); // Log the error for debugging purposes
    // Handle specific error types
    
    if (err.name === 'noAuth') {
      return res.status(400).json({ error: err.message });
    }
    if(err.name ==="user already exists"){
      return res.status(400).json({ error: err.name });
    }
    if(err.name ==="product doesn't exist in cart"){
      return res.status(400).json({ error: err.name });
    }

    // For any other errors, return a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }



export default errorHnadler;