const request = require('supertest');
// Mock uuid before requiring app
jest.mock('uuid', () => ({
    v4: () => '12345678-1234-1234-1234-123456789012'
}));
const app = require('../src/app');
const Name = require('../src/models/Name');
const fs = require('fs');

// Mock Name model
jest.mock('../src/models/Name');

// Mock index.html template loading for renderer tests
jest.spyOn(fs, 'existsSync').mockImplementation((p) => {
    if (p && p.includes('index.html')) return true;
    return false;
});
jest.spyOn(fs, 'readFileSync').mockImplementation((p, opt) => {
    if (p && p.includes('index.html')) {
        return '<!DOCTYPE html><html><head><link rel="stylesheet" href="/assets/index-123.css"><script src="/assets/index-456.js"></script></head><body><div id="root"></div></body></html>';
    }
    throw new Error(`Unexpected readFileSync call on path: ${p}`);
});

// Mock process.env
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

describe('Names API', () => {
    // Mocking the query chain for Name.find()
    const mockNameQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([
            {
                _id: '507f1f77bcf86cd799439011',
                nameEnglish: 'Ahmed',
                nameArabic: 'أحمد',
                meaning: 'Praiseworthy',
                isActive: true,
                isPremium: false,
            }
        ]),
        then: jest.fn().mockImplementation(function(callback) {
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
            ]).then(callback);
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
            expect(res.headers['cache-control']).toBe('public, s-maxage=300, stale-while-revalidate=600');
            
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

        it('should fetch a single name by slug', async () => {
            const mockName = {
                _id: validId,
                nameEnglish: 'Ahmed',
                slug: 'ahmed',
                isActive: true,
                toObject: jest.fn().mockReturnValue({
                    _id: validId,
                    nameEnglish: 'Ahmed',
                    slug: 'ahmed',
                    isActive: true
                })
            };
            
            Name.findOne.mockResolvedValue(mockName);

            const res = await request(app).get('/api/v1/names/ahmed');

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.nameEnglish).toBe('Ahmed');
            expect(Name.findOne).toHaveBeenCalledWith({ slug: 'ahmed' });
        });

        it('should return 404 if name not found', async () => {
            Name.findById.mockResolvedValue(null);
            Name.findOne.mockResolvedValue(null);

            const res = await request(app).get(`/api/v1/names/${validId}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 for invalid ID format', async () => {
            const res = await request(app).get('/api/v1/names/invalid id!');

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Invalid ID format');
        });
    });

    describe('GET /api/v1/names/render/:idOrSlug', () => {
        const validId = '507f1f77bcf86cd799439011';

        it('should render the name HTML page successfully', async () => {
            const mockName = {
                _id: validId,
                nameEnglish: 'Ahmed',
                nameArabic: 'أحمد',
                meaning: 'Praiseworthy',
                gender: 'boy',
                origin: 'Arabic',
                isActive: true
            };
            Name.findById.mockResolvedValue(mockName);

            const res = await request(app).get(`/api/v1/names/render/${validId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toContain('text/html');
            expect(res.headers['link']).toBe('</assets/index-123.css>; rel=preload; as=style, </assets/index-456.js>; rel=modulepreload');
            expect(res.text).toContain('Ahmed');
            expect(res.text).toContain('Praiseworthy');
            expect(res.text).toContain('Arabic');
        });

        it('should return 404 HTML if name is not found', async () => {
            Name.findOne.mockResolvedValue(null);

            const res = await request(app).get('/api/v1/names/render/nonexistent');

            expect(res.statusCode).toEqual(404);
            expect(res.headers['content-type']).toContain('text/html');
            expect(res.text).toContain('Name Not Found');
        });
    });

    describe('GET /api/v1/names/render-home', () => {
        it('should render the home HTML page successfully', async () => {
            Name.find.mockReturnValue(mockNameQuery);

            const res = await request(app).get('/api/v1/names/render-home');

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toContain('text/html');
            expect(res.headers['link']).toBe('</assets/index-123.css>; rel=preload; as=style, </assets/index-456.js>; rel=modulepreload');
            expect(res.text).toContain('IslamicNames');
            expect(res.text).toContain('Ahmed');
            expect(res.text).toContain('Praiseworthy');
        });
    });

    describe('GET /api/v1/names/sitemap.xml', () => {
        it('should generate sitemap.xml with lastmod for static routes and blog articles', async () => {
            const mockNameQuery = {
                select: jest.fn().mockResolvedValue([
                    {
                        _id: '507f1f77bcf86cd799439011',
                        slug: 'ahmed',
                        updatedAt: new Date('2026-06-15T12:00:00.000Z')
                    }
                ])
            };
            Name.find.mockReturnValue(mockNameQuery);

            const res = await request(app).get('/api/v1/names/sitemap.xml');

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toContain('application/xml');
            
            const currentDate = new Date().toISOString().split('T')[0];
            
            // Verify static routes have lastmod
            expect(res.text).toContain(`<loc>https://www.islamicnames.in</loc>\n    <lastmod>${currentDate}</lastmod>`);
            expect(res.text).toContain(`<loc>https://www.islamicnames.in/search</loc>\n    <lastmod>${currentDate}</lastmod>`);
            expect(res.text).toContain(`<loc>https://www.islamicnames.in/free-service</loc>\n    <lastmod>${currentDate}</lastmod>`);
            expect(res.text).toContain(`<loc>https://www.islamicnames.in/blog</loc>\n    <lastmod>${currentDate}</lastmod>`);

            // Verify blog articles have lastmod
            expect(res.text).toContain(`<loc>https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f</loc>\n    <lastmod>${currentDate}</lastmod>`);

            // Verify dynamic name routes have correct lastmod from DB
            expect(res.text).toContain('<loc>https://www.islamicnames.in/name/ahmed</loc>\n    <lastmod>2026-06-15</lastmod>');
        });
    });
});
