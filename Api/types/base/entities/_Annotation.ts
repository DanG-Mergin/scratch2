import { v4 as uuidv4 } from 'uuid';
import { Entity } from './_Entity';

export class Annotation {
  private name = "annotation";
  uuid?: string;
  docID: string;
  entities: Entity[];
  timestamp: Date;
  authorID: string;

  constructor({ uuid, docID, entities, authorID }: { uuid?: string, docID: string, entities: Entity[], authorID: string }) {
    this.uuid = uuid ? uuid : `rev_${uuidv4()}`;
    this.docID = docID;
    this.entities = entities;
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
      "entities": this.entities,
    }
  }
}