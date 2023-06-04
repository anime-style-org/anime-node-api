enum modelType {
  'New',
  'Existing'
}

interface jobMetadata {
  style: String;
  pose: String;
}

export interface UserType {
  id: String;
  email: String;
  name: String;
  dob: String;
  balance: Number;
}

export interface JobType {
  id: String;
  userId: String;
  modelType: modelType;
  metadata: [jobMetadata];
  imagesUploaded: Number;
  status:
    | 'DRAFT'
    | 'QUEUED'
    | 'MODEL_CREATING'
    | 'MODEL_CREATED'
    | 'MODEL_TRAINING'
    | 'MODEL_TRAINED'
    | 'ENDPOINT_CREATING'
    | 'ENDPOINT_CREATED'
    | 'OUTPUT_GENERATING'
    | 'OUTPUT_GENERATED'
    | 'INPUT_DELETING'
    | 'INPUT_DELETED'
    | 'NOTIFYING'
    | 'NOTIFIED'
    | 'COMPLETED';
  createdAt: Number;
  finishedAt: Number;
}

export interface ModelType {
  id: String;
  jobId: String;
  userId: String;
  buckerUrl: String;
  createdAt: Number;
}

export interface InferenceType {
  id: String;
  modelId: String;
  jobId: String;
  userId: String;
  bucketUrl: String;
  createdAt: Number;
}

export interface StylesInterface {
  id: String;
  name: String;
}
