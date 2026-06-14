const request = require('supertest');
// Mock uuid before requiring app
jest.mock('uuid', () => ({
    v4: () => '12345678-1234-1234-1234-123456789012'
}));
const app = require('../src/app');
const User = require('../src/models/User');

// Mock User model
jest.mock('../src/models/User');

// Mock process.env
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            // Mocking User.create to return a user object
            User.create.mockResolvedValue({
                _id: '507f1f77bcf86cd799439011',
                name: userData.name,
                email: userData.email
            });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            // Assertions
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            
            expect(User.create).toHaveBeenCalledWith(userData);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should login successfully with correct credentials', async () => {
            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                email: loginData.email,
                isActive: true,
                matchPassword: jest.fn().mockResolvedValue(true)
            };

            // Mock the findOne().select() query chain
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            // Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            
            expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
            expect(mockUser.matchPassword).toHaveBeenCalledWith(loginData.password);
        });

        it('should return 401 for non-existent user', async () => {
            // Mock findOne to return null via the chain
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return 401 if password does not match', async () => {
            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                email: loginData.email,
                isActive: true,
                matchPassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return 400 if email or password is missing', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@example.com' }); // missing password

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Please provide an email and password');
        });
    });
});
