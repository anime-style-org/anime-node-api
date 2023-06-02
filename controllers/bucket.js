import { PutObjectCommand } from '@aws-sdk/client-s3';

import { S3_CLIENT, S3_BUCKET_NAME } from '../config.js';

export const createUserFolder = async (authId) => {
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `users/${authId}/`
      // Body: _blob,
      // ContentType: 'image/png'
    };
    await S3_CLIENT.send(new PutObjectCommand(params));
    return { err: null, response: { folderPath: `users/${authId}/` } };
  } catch (err) {
    console.log(err);
    return { err: 'Error creating folder', response: null };
  }
};
