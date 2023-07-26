import { v4 as uuidv4 } from 'uuid';

export interface EntityI {
    uuid?: string;
    startIndex: number;
    endIndex: number;
    startChar?: number;
    endChar?: number;
    labelId: string;
    text?: string;
}

export class Entity {
    private name = "entity";
    uuid?: string;
    startIndex: number;
    endIndex: number;
    startChar?: number;
    endChar?: number;
    labelId: string;
    text?: string;

    constructor({ uuid, startIndex, endIndex, startChar, endChar, labelId, text }: EntityI) {
        this.uuid = uuid ? uuid : `entity_${uuidv4()}`;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.startChar = startChar ? startChar : null;
        this.endChar = endChar ? endChar : null;
        this.labelId = labelId;
        this.text = text ? text : '';
    }

    //@ts-ignore
    toJSON() {
        return {
            "name": this.name,
            //   "id": this.id,
            "uuid": this.uuid,
            "start_index": this.startIndex,
            "end_index": this.endIndex,
            "start_char": this.startChar,
            "end_char": this.endChar,
            "label_id": this.labelId,
            "text": this.text,
        }
    }
}