import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { verify } from 'jsonwebtoken';
import { PORT } from './config.ts';

import {
  createUserDocument,
  getUserDocument,
  updateUserCreditsBalance
} from './controllers/database/accounts.ts';

import { getAllStyles } from './controllers/database/styles.ts';

import {
  createJobDocument,
  getUserJobs,
  updateJobStatus,
  uploadImageForJob
} from './controllers/database/jobs.ts';

import {
  createModelDocument,
  getUserModels
} from './controllers/database/models.ts';

import {
  createInferenceDocument,
  getUserInferences
} from './controllers/database/inferences.ts';

import { JWT_SECRET } from './config.ts';

interface JwtPayload {
  userId: String;
  jobId: String;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// UPLOAD IMAGE TO S3 FOR JOBS
app.post('/api/v1/job/image/upload', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { jobId } = req.body;

    const { file } = req.files as any;

    let databaseResponse = await uploadImageForJob({ userId, jobId, file });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// CREATE NEW USER
app.post('/api/v1/user/create', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { email, name, dob } = req.body;
    let databaseResponse = await createUserDocument({
      userId,
      email,
      name,
      dob,
      initialBalance: 0
    });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// GET USER
app.post('/api/v1/user/get', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let databaseResponse = await getUserDocument({ userId });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// UPDATE USER CREDITS BALANCE
app.post('/api/v1/user/update/balance', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { balanceToAdd } = req.body;
    let databaseResponse = await updateUserCreditsBalance({
      userId,
      balanceToAdd
    });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// GET ALL STYLE OPTIONS TO CHOOSE
app.post('/api/v1/styles/get', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    verify(token!, JWT_SECRET!);

    let databaseResponse = await getAllStyles();
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// CREATE JOB TO TRAIN
app.post('/api/v1/job/create', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { metadata, modelType } = req.body;
    let createdAt = Date.now();

    let databaseResponse = await createJobDocument({
      userId,
      metadata,
      modelType,
      createdAt,
      status: 'DRAFT'
    });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// UPDATE JOB STATUS AT EACH STAGE
app.post('/api/v1/job/status/update', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { jobId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { status } = req.body;
    let databaseResponse = await updateJobStatus({ jobId, status });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// GET JOBS BY USER
app.post('/api/v1/user/jobs/get', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let databaseResponse = await getUserJobs({ userId });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// CREATE MODEL AFTER SUCCESSFUL JOB COMPLETION
app.post('/api/v1/model/create', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { jobId, bucketUrl } = req.body;
    let databaseResponse = await createModelDocument({
      userId,
      jobId,
      bucketUrl
    });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// GET MODELS BY USER
app.post('/api/v1/user/models/get', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let databaseResponse = await getUserModels({ userId });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// CREATE INFERENCE
app.post('/api/v1/inference/create', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let { jobId, modelId, bucketUrl } = req.body;
    let databaseResponse = await createInferenceDocument({
      userId,
      jobId,
      modelId,
      bucketUrl
    });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

// GET INFERENCES BY USER
app.post('/api/v1/user/inferences/get', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { userId } = verify(token!, JWT_SECRET!) as JwtPayload;
    let databaseResponse = await getUserInferences({ userId });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}..`));
