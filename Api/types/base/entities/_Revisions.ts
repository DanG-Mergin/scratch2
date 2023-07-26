import { v4 as uuidv4 } from 'uuid';
import { Change } from './_Change';

export class Revisions {
  private name = "revisions";
  uuid?: string;
  docID: string;
  changes: Change[];
  timestamp: Date;
  authorID: string;

  constructor({ uuid, docID, changes, authorID }: { uuid?: string, docID: string, changes: Change[], authorID: string }) {
    this.uuid = uuid ? uuid : `rev_${uuidv4()}`;
    this.docID = docID;
    this.changes = changes;
    this.timestamp = new Date();
    this.authorID = authorID;
  }

  //@ts-ignore
  toJSON() {
    return {
      "name": this.name,
      "uuid": this.uuid,
      "doc_id": this.docID,
      "author_id": this.authorID,
      "timestamp": this.timestamp,
      "changes": this.changes,
    }
  }
}