import express from 'express';
import cors from 'cors';

import { PORT } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

// Auth
// POST - Account Create (sign up)
// POST - User Account Details (sign in)

// Payments
// POST - Update Balance (deposit funds)

// Training
// POST - Image Uploads
// POST - Trigger Training
// GET  - Bucket Tokens / Creds
// GET  - User Albums

// Webhooks
// POST - Training Complete

app.listen(PORT, () => console.log(`Listening on port ${PORT}..`));
