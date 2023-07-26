import { Entity } from './_Entity';
import { v4 as uuidv4 } from 'uuid';
import { Token } from './_Token';
import { DocType, PatientClass } from '../../enums';

export interface DocI {
    uuid?: string;
    text: string;
    entities?: Entity[];
    tokens?: Token[];
    title?: string;
    patientClasses?: string[];
    docTypes?: string[];
}

export class Doc {
    private name = "doc";
    uuid: string;
    text: string;
    private _entities: Entity[];
    private _tokens: Token[];
    title?: string;
    _patientClasses?: string[];
    _docTypes?: DocType[];

    constructor({ text, entities, tokens, uuid, title, patientClasses, docTypes }: DocI) {
        this.uuid = uuid ? uuid : `doc_${uuidv4()}`;
        this.text = text;
        this.entities = entities ? entities : [];
        this.tokens = tokens ? tokens : [];
        this.title = title ? title : null;
        this.patientClasses = patientClasses ? patientClasses : null;
        this.docTypes = docTypes ? docTypes : null;
    }

    set patientClasses(patientClasses: string[]) {
        this._patientClasses = patientClasses.map((s) => { return s.toLowerCase().replace(' ', '_') as PatientClass });
    }
    get patientClasses(): string[] {
        return this._patientClasses;
    }

    set docTypes(docTypes: string[]) {
        this._docTypes = docTypes.map((s) => { return s.toLowerCase().replace(' ', '_') as DocType });
    }
    get docTypes(): string[] {
        return this._docTypes;
    }

    set tokens(tokens: any[]) {
        const _tokens = tokens.map((token: any) => {
            return new Token(
                token
            );
        });
        this._tokens = _tokens;
    }

    get tokens(): Token[] {
        return this._tokens;
    }

    set entities(_entities: any[]) {
        const entities = _entities.map((entity: any) => {
            return new Entity(
                entity
            );
        });
        this._entities = entities;
    }

    get entities(): Entity[] {
        return this._entities;
    }

    toJSON() {
        return {
            name: this.name,
            uuid: this.uuid,
            text: this.text,
            entities: this.entities,
            tokens: this.tokens,
            title: this.title,
            patient_classes: this.patientClasses,
            doc_types: this.docTypes,
        }
    }
}

