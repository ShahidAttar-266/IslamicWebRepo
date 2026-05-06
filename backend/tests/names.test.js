const request = require('supertest');
// Mock uuid before requiring app
jest.mock('uuid', () => ({
    v4: () => '12345678-1234-1234-1234-123456789012'
}));
const app = require('../src/app');
const Name = require('../src/models/Name');

// Mock Name model
jest.mock('../src/models/Name');

// Mock process.env
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

describe('Names API', () => {
    // Mocking the query chain for Name.find()
    const mockNameQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(function() {
            // This is the end of the chain in our controller
            return Promise.resolve([
                {
                    _id: '507f1f77bcf86cd799439011',
                    nameEnglish: 'Ahmed',
                    nameArabic: 'أحمد',
                    meaning: 'Praiseworthy',
                    isActive: true,
                    isPremium: false,
                    toObject: function() { return this; }
                }
            ]);
        })
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/names', () => {
        it('should fetch all names successfully', async () => {
            // Setup mocks
            Name.find.mockReturnValue(mockNameQuery);
            Name.countDocuments.mockResolvedValue(1);

            const res = await request(app).get('/api/v1/names');

            // Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].nameEnglish).toBe('Ahmed');
            
            // Verify Mongoose calls
            expect(Name.find).toHaveBeenCalled();
            expect(Name.countDocuments).toHaveBeenCalled();
        });
    });

    describe('GET /api/v1/names/:id', () => {
        const validId = '507f1f77bcf86cd799439011';

        it('should fetch a single name by ID', async () => {
            const mockName = {
                _id: validId,
                nameEnglish: 'Ahmed',
                isActive: true,
                toObject: jest.fn().mockReturnValue({
                    _id: validId,
                    nameEnglish: 'Ahmed',
                    isActive: true
                })
            };
            
            Name.findById.mockResolvedValue(mockName);

            const res = await request(app).get(`/api/v1/names/${validId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.nameEnglish).toBe('Ahmed');
        });

        it('should return 404 if name not found', async () => {
            Name.findById.mockResolvedValue(null);

            const res = await request(app).get(`/api/v1/names/${validId}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 for invalid ID format', async () => {
            const res = await request(app).get('/api/v1/names/invalid-id');

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Invalid ID format');
        });
    });
});
