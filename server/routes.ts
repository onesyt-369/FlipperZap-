import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { createAIService } from "./services/ai";
import { createMarketplaceService } from "./services/marketplace";
import { initializeWebSocketService, getWebSocketService } from "./services/websocket";
import { insertScanSchema, insertListingSchema, insertMarketplaceConnectionSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize services
  const aiService = createAIService();
  const marketplaceService = createMarketplaceService();
  const wsService = initializeWebSocketService(httpServer);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      mock_mode: {
        ai_vision: process.env.USE_MOCK_AI !== 'false',
        marketplace: process.env.USE_MOCK_MARKETPLACE !== 'false',
        email: process.env.USE_MOCK_EMAIL !== 'false',
        payments: process.env.USE_MOCK_PAYMENTS !== 'false'
      }
    });
  });

  // Scan endpoints
  app.post('/api/v1/scans/analyze', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const userId = req.headers['x-user-id'] as string || 'demo-user';
      const imageUrl = `/uploads/${req.file.filename}`;

      // Create initial scan record
      const scan = await storage.createScan({
        userId,
        imageUrl,
        status: 'processing'
      });

      // Send immediate response with scan ID
      res.json({ scanId: scan.id, status: 'processing' });

      // Process AI analysis asynchronously
      try {
        wsService.sendScanUpdate(userId, scan.id, 'analyzing');
        
        const analysis = await aiService.analyzeToy(imageUrl);
        
        // Update scan with results
        const updatedScan = await storage.updateScan(scan.id, {
          status: 'completed',
          aiAnalysis: analysis,
          estimatedPriceMin: analysis.estimatedPriceMin.toString(),
          estimatedPriceMax: analysis.estimatedPriceMax.toString()
        });

        // Create toy record
        await storage.createToy({
          name: analysis.toyName,
          brand: analysis.brand,
          category: analysis.category,
          condition: analysis.condition,
          description: analysis.description,
          imageUrl,
          aiAnalysis: analysis
        });

        wsService.sendScanUpdate(userId, scan.id, 'completed', updatedScan);
      } catch (error) {
        console.error('AI analysis failed:', error);
        await storage.updateScan(scan.id, { status: 'failed' });
        wsService.sendScanUpdate(userId, scan.id, 'failed', { error: error.message });
      }
    } catch (error) {
      console.error('Scan creation failed:', error);
      res.status(500).json({ error: 'Failed to create scan' });
    }
  });

  app.get('/api/v1/scans', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string || 'demo-user';
      const scans = await storage.getScansByUser(userId);
      res.json(scans);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
      res.status(500).json({ error: 'Failed to fetch scans' });
    }
  });

  app.get('/api/v1/scans/:id', async (req, res) => {
    try {
      const scan = await storage.getScan(req.params.id);
      if (!scan) {
        return res.status(404).json({ error: 'Scan not found' });
      }
      res.json(scan);
    } catch (error) {
      console.error('Failed to fetch scan:', error);
      res.status(500).json({ error: 'Failed to fetch scan' });
    }
  });

  // Listing endpoints
  app.post('/api/v1/listings', async (req, res) => {
    try {
      const listingData = insertListingSchema.parse(req.body);
      const listing = await storage.createListing(listingData);

      // If auto-list is enabled, create marketplace listing
      if (req.body.autoList && req.body.marketplace) {
        try {
          const marketplaceListing = await marketplaceService.createListing(
            req.body.marketplace,
            {
              title: listing.title,
              description: listing.description || '',
              price: parseFloat(listing.price),
              imageUrl: req.body.imageUrl || ''
            }
          );

          await storage.updateListing(listing.id, {
            marketplaceListingId: marketplaceListing.id,
            status: 'active',
            listedAt: new Date()
          });

          const userId = req.headers['x-user-id'] as string || 'demo-user';
          getWebSocketService().sendListingUpdate(userId, listing.id, 'listed', marketplaceListing);
        } catch (error) {
          console.error('Marketplace listing failed:', error);
        }
      }

      res.json(listing);
    } catch (error) {
      console.error('Failed to create listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  });

  app.get('/api/v1/listings', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string || 'demo-user';
      const listings = await storage.getListingsByUser(userId);
      res.json(listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  });

  app.get('/api/v1/listings/scan/:scanId', async (req, res) => {
    try {
      const listings = await storage.getListingsByScan(req.params.scanId);
      res.json(listings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  });

  // Marketplace connection endpoints
  app.get('/api/v1/marketplace/connections', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string || 'demo-user';
      const connections = await storage.getMarketplaceConnections(userId);
      
      // Return status for all supported marketplaces
      const marketplaces = ['ebay', 'amazon', 'wordpress'];
      const status = marketplaces.map(marketplace => {
        const connection = connections.find(c => c.marketplace === marketplace);
        return {
          marketplace,
          connected: connection?.isConnected || false,
          lastUpdated: connection?.updatedAt
        };
      });
      
      res.json(status);
    } catch (error) {
      console.error('Failed to fetch marketplace connections:', error);
      res.status(500).json({ error: 'Failed to fetch marketplace connections' });
    }
  });

  app.post('/api/v1/marketplace/connect', async (req, res) => {
    try {
      const connectionData = insertMarketplaceConnectionSchema.parse(req.body);
      const userId = req.headers['x-user-id'] as string || 'demo-user';
      
      const existingConnection = await storage.getMarketplaceConnection(userId, connectionData.marketplace);
      
      if (existingConnection) {
        const updated = await storage.updateMarketplaceConnection(existingConnection.id, {
          isConnected: true,
          ...connectionData
        });
        res.json(updated);
      } else {
        const connection = await storage.createMarketplaceConnection({
          ...connectionData,
          userId,
          isConnected: true
        });
        res.json(connection);
      }
    } catch (error) {
      console.error('Failed to connect marketplace:', error);
      res.status(500).json({ error: 'Failed to connect marketplace' });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static(uploadDir));

  return httpServer;
}
