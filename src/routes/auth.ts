import { Router, Request, Response } from 'express';
import { generateToken, verifyToken, JWTPayload } from '../auth/jwt';
import { authenticateUser, getUserById } from '../services/userService';
import { authenticateToken } from '../middleware/auth';
import { attachUserContext } from '../middleware/rbac';

export const authRoutes = Router();

/**
 * POST /api/auth/login
 * 
 * Login endpoint that generates a JWT token with role information
 * Uses phone number for authentication (simplified for demo)
 */
authRoutes.post('/login', async (req: Request, res: Response) => {
  const { phone_number } = req.body;

  // Basic validation
  if (!phone_number) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'phone_number is required'
    });
  }

  try {
    // Authenticate user (creates user if doesn't exist)
    const user = await authenticateUser(phone_number);
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid phone number'
      });
    }

    // Generate JWT token with role
    const token = generateToken({ 
      userId: user.id, 
      email: `${phone_number}@mobile-money.local`, // Generate email from phone
      role: user.role_name || 'user'
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.id,
        phone_number: user.phone_number,
        kyc_level: user.kyc_level,
        role: user.role_name || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/auth/verify
 * 
 * Verify a JWT token and return the decoded payload
 */
authRoutes.post('/verify', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Missing token',
      message: 'Token is required for verification'
    });
  }

  try {
    const payload = verifyToken(token);
    res.json({
      valid: true,
      payload
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Token verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/auth/me
 * 
 * Protected route that returns current user information with role and permissions
 * Requires valid JWT token in Authorization header
 */
authRoutes.get('/me', authenticateToken, attachUserContext, async (req: Request, res: Response) => {
  try {
    if (!req.jwtUser) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Get full user information
    const user = await getUserById(req.jwtUser.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User associated with token no longer exists'
      });
    }

    res.json({
      user: {
        userId: user.id,
        phone_number: user.phone_number,
        kyc_level: user.kyc_level,
        role: user.role_name || 'user',
        permissions: req.userPermissions || []
      },
      tokenInfo: {
        issuedAt: req.jwtUser.iat,
        expiresAt: req.jwtUser.exp
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get user information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
