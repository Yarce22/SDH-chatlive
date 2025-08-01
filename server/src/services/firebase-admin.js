import admin from "firebase-admin";
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  await readFile(
    path.resolve(__dirname, '../key/firebase/serviceAccountKey.json'),
    'utf8'
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db, admin };
