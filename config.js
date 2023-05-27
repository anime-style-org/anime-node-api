import { S3Client } from '@aws-sdk/client-s3';

import * as dotenv from 'dotenv';
dotenv.config();

const DEV_MODE = process.env.DEV_MODE === 'true' ? true : false;

export const PORT = process.env.PORT || 5000;
// export const JWT_SECRET = process.env.JWT_SECRET;

// export const s3Client = DEV_MODE
//   ? new S3Client({
//       region: process.env.AWS_S3_REGION_DEV,
//       credentials: {
//         accessKeyId: process.env.AWS_S3_ACCESS_KEY_DEV,
//         secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_DEV
//       }
//     })
//   : new S3Client({
//       region: process.env.AWS_S3_REGION_PROD,
//       credentials: {
//         accessKeyId: process.env.AWS_S3_ACCESS_KEY_PROD,
//         secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_PROD
//       }
//     });
