const request = require('supertest');
const app = require('../src/app');

// Mock process.env
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

describe('API Root Routes', () => {
    describe('GET /api/v1', () => {
        it('should return API status and version', async () => {
            const res = await request(app).get('/api/v1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                success: true,
                message: 'Islamic Web API Running',
                version: 'v1'
            });
        });
    });

    describe('GET /', () => {
        it('should return welcome message', async () => {
            const res = await request(app).get('/');

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Welcome to IslamicNames API');
        });
    });

    describe('GET /api/v1/health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/api/v1/health');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                status: 'success',
                message: 'API is running'
            });
        });
    });
});
