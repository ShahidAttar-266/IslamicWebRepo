// Set rate limit before importing app to configure the limiter
process.env.AUTH_RATE_LIMIT = '3';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const request = require('supertest');
jest.mock('uuid', () => ({
    v4: () => '12345678-1234-1234-1234-123456789012'
}));
const app = require('../src/app');
const User = require('../src/models/User');

// Mock User model
jest.mock('../src/models/User');

describe('Auth Routes Rate Limiting', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should rate limit login attempts after 3 requests', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            isActive: true,
            matchPassword: jest.fn().mockResolvedValue(false) // Fail validation to simulate incorrect attempts
        };

        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        // 1st attempt
        let res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);

        // 2nd attempt
        res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);

        // 3rd attempt
        res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);

        // 4th attempt (should be blocked)
        res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        
        expect(res.statusCode).toEqual(429);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Too many login attempts, please try again after 15 minutes.');
    });

    it('should rate limit registration attempts after 3 requests', async () => {
        // Mock User.create to return a user object
        User.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            name: 'Test',
            email: 'test-register@example.com'
        });

        // 1st attempt
        let res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test', email: 'test-register@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(201);

        // 2nd attempt
        res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test', email: 'test-register@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(201);

        // 3rd attempt
        res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test', email: 'test-register@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(201);

        // 4th attempt (should be blocked)
        res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test', email: 'test-register@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(429);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Too many registration attempts, please try again after 15 minutes.');
    });
});
