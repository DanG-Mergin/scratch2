import { MsgEntityType, MsgEntity, MsgAction, MsgStatus, MsgType } from "../../enums";
import { v4 as uuidv4 } from 'uuid';

export interface LabelI {
    category: string;
    subcategory: string;
    types: string[];
    tag: string;
    tasks: string[];
    kb_id?: string;
    uuid: string;
    short_description?: string;
    description?: string;
    instructions?: string;
    substitutionId?: string;
    badgeName?: string;
    icon?: string;
}

export class Label implements LabelI {
    private name = "label";
    public category: string;
    public subcategory: string;
    public types: string[];
    public tag: string;
    public tasks: string[];
    public kb_id?: string;
    public uuid: string;
    public short_description?: string;
    public description?: string;
    public instructions?: string;
    public substitutionId?: string;
    public badgeName?: string;
    public icon?: string;

    constructor(data: Label) {
        this.category = data.category;
        this.subcategory = data.subcategory;
        this.types = data.types;
        this.tag = data.tag;
        this.tasks = data.tasks;
        this.kb_id = data.kb_id ? data.kb_id : `label_${uuidv4()}`;
        this.uuid = data.uuid ? data.uuid : `label_${uuidv4()}`;
        this.short_description = data.short_description;
        this.description = data.description;
        this.instructions = data.instructions;
        this.substitutionId = data.substitutionId;
        this.badgeName = data.badgeName ? data.badgeName : `fox_four`;
        this.icon = data.icon ? data.icon : `default`;
    }
}