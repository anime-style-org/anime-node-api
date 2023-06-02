import express from 'express';
import cors from 'cors';

import { verify } from 'jsonwebtoken';
import { PORT } from './config.js';

import {
  createUserDocument,
  getUserDocument,
  updateUserCreditsBalance
} from './controllers/database/accounts.js';

import { getAllStyles } from './controllers/database/styles.js';

import {
  createJobDocument,
  getUserJobs,
  updateJobStatus
} from './controllers/database/jobs.js';

import {
  createModelDocument,
  getUserModels
} from './controllers/database/models.js';

import {
  createInferenceDocument,
  getUserInferences
} from './controllers/database/inferences.js';

const app = express();

app.use(cors());
app.use(express.json());

// CREATE NEW USER
app.post('/api/v1/user/create', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try {
    let { authId } = verify(token, JWT_SECRET);
    let { email, name, dob } = req.body;
    let databaseResponse = await createUserDocument({
      authId: authId,
      email: email,
      name: name,
      dob: dob
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
    let { authId } = verify(token, JWT_SECRET);
    let databaseResponse = await getUserDocument({
      authId: authId
    });
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
    let { authId } = verify(token, JWT_SECRET);
    let { balanceToAdd } = req.body;
    let databaseResponse = await updateUserCreditsBalance({
      authId: authId,
      balanceToAdd: balanceToAdd
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
    verify(token, JWT_SECRET);

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
    let { authId } = verify(token, JWT_SECRET);
    let { metadata, modelType } = req.body;
    let databaseResponse = await createJobDocument({
      metadata: metadata,
      authId: authId,
      modelType: modelType
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
    let { jobId } = verify(token, JWT_SECRET);
    let { status } = req.body;
    let databaseResponse = await updateJobStatus({
      jobId: jobId,
      status: status
    });
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
    let { authId } = verify(token, JWT_SECRET);
    let databaseResponse = await getUserJobs({ authId: authId });
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
    let { authId } = verify(token, JWT_SECRET);
    let { jobId, bucketUrl } = req.body;
    let databaseResponse = await createModelDocument({
      authId: authId,
      jobId: jobId,
      bucketUrl: bucketUrl
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
    let { authId } = verify(token, JWT_SECRET);
    let databaseResponse = await getUserModels({ authId: authId });
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
    let { authId } = verify(token, JWT_SECRET);
    let { jobId, modelId, bucketUrl } = req.body;
    let databaseResponse = await createInferenceDocument({
      authId: authId,
      jobId: jobId,
      modelId: modelId,
      bucketUrl: bucketUrl
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
    let { authId } = verify(token, JWT_SECRET);
    let databaseResponse = await getUserInferences({ authId: authId });
    res.json(databaseResponse);
  } catch (err) {
    res.json({ err: 'Invalid Token', response: null });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}..`));
