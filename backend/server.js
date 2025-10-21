import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { getAdminFromToken } from './utils/adminAuth.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration - must be before other middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://portfolio-oij-iota.vercel.app',
        'https://portfolio-7qkj0x0xt.vercel.app',
        /^https:\/\/portfolio-.*\.vercel\.app$/  // Allow all Vercel preview URLs
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Serve uploaded files statically with CORS headers (must be before body parser)
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Upload Routes
app.use('/api/upload', uploadRoutes);

// Rate Limiting
app.use('/graphql', apiLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Apollo GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    };
  },
  introspection: process.env.NODE_ENV !== 'production',
});

// Start Apollo Server
await server.start();

// GraphQL Endpoint with JWT context
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      // Extract JWT token from Authorization header
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      
      // Get admin from token (for admin operations)
      const admin = getAdminFromToken(token);
      
      return { token, admin };
    },
  })
);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
