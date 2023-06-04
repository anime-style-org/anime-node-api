import { S3Client } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;

export const S3_CLIENT = new S3Client({
  region: process.env.AWS_S3_REGION_DEV,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_DEV || '',
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_DEV || ''
  }
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME_DEV;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY_DEV,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN_DEV,
  projectId: process.env.FIREBASE_PROJECT_ID_DEV,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_DEV,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID_DEV,
  appId: process.env.FIREBASE_APP_ID_DEV
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
