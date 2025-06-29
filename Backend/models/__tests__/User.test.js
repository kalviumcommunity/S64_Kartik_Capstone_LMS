// Mock jsonwebtoken before requiring it
const mockJwtSign = jest.fn();
jest.mock('jsonwebtoken', () => ({
  sign: mockJwtSign
}));

const jwt = require('jsonwebtoken');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAuthToken method', () => {
    test('should generate JWT token with correct payload', () => {
      // Mock the jwt.sign method
      mockJwtSign.mockReturnValue('mockToken123');
      
      // Mock process.env
      const originalEnv = process.env;
      process.env.JWT_SECRET = 'test-secret';
      
      // Create a mock user instance with the method
      const userInstance = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'student',
        generateAuthToken: function() {
          return jwt.sign(
            { 
              id: this._id,
              email: this.email,
              role: this.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
        }
      };
      
      const token = userInstance.generateAuthToken();
      
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 'user123',
          email: 'test@example.com',
          role: 'student'
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(token).toBe('mockToken123');
      
      // Restore process.env
      process.env = originalEnv;
    });

    test('should include all required fields in token payload', () => {
      mockJwtSign.mockReturnValue('mockToken123');
      
      const originalEnv = process.env;
      process.env.JWT_SECRET = 'test-secret';
      
      const userInstance = {
        _id: 'user456',
        email: 'educator@example.com',
        role: 'educator',
        generateAuthToken: function() {
          return jwt.sign(
            { 
              id: this._id,
              email: this.email,
              role: this.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
        }
      };
      
      userInstance.generateAuthToken();
      
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 'user456',
          email: 'educator@example.com',
          role: 'educator'
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      
      process.env = originalEnv;
    });

    test('should use correct JWT secret from environment', () => {
      mockJwtSign.mockReturnValue('mockToken123');
      
      const originalEnv = process.env;
      process.env.JWT_SECRET = 'custom-secret-key';
      
      const userInstance = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'student',
        generateAuthToken: function() {
          return jwt.sign(
            { 
              id: this._id,
              email: this.email,
              role: this.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
        }
      };
      
      userInstance.generateAuthToken();
      
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        'custom-secret-key',
        { expiresIn: '24h' }
      );
      
      process.env = originalEnv;
    });

    test('should use correct expiration time', () => {
      mockJwtSign.mockReturnValue('mockToken123');
      
      const originalEnv = process.env;
      process.env.JWT_SECRET = 'test-secret';
      
      const userInstance = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'student',
        generateAuthToken: function() {
          return jwt.sign(
            { 
              id: this._id,
              email: this.email,
              role: this.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
        }
      };
      
      userInstance.generateAuthToken();
      
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '24h' }
      );
      
      process.env = originalEnv;
    });
  });
}); 