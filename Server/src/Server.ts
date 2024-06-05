import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Content, IContent } from './Model';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/richTextEditor').then(() => { 
  console.log('Connected to MongoDB');
}).catch((error: any) => {
  console.error('MongoDB connection error:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes

// Create content
app.post('/api/content', async (req: Request, res: Response) => {
  try {
    const { title, content, userEmail } = req.body as IContent;
    const newContent = await Content.create({ title, content, userEmail });
    res.status(201).json(newContent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Read all content for a user
app.get('/api/content/:userEmail', async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;
    const contentList = await Content.find({ userEmail });
    res.status(200).json(contentList);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Read a single content by ID
app.get('/api/content-by-id/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update content by ID
app.put('/api/content/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete content by ID
app.delete('/api/content/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
