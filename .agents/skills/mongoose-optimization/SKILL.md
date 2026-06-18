---
name: mongoose-optimization
description: Optimize Mongoose queries and schemas.
---

# mongoose-optimization
Mongoose performance tips:
- Create appropriate indexes for frequent queries.
- Use `.lean()` for read-only queries to improve performance.
- Avoid N+1 query problems by using `populate` wisely or using aggregation.
