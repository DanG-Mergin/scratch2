
import { v4 as uuidv4 } from 'uuid';
import { MsgEntityType, MsgEntity, MsgAction, MsgStatus, MsgType, MsgTask } from '../enums';
import config from 'data/api/config';

export interface _DataI {
    items: object[] | undefined
    item_ids: string[]
}

export interface _ObservableI {
    uuid?: string
    action: MsgAction
    status: MsgStatus
    type: MsgType
    task?: MsgTask
    data?: object
    entity: MsgEntity
    entityType: MsgEntityType
}

export class _Observable implements _ObservableI {
    _uuid?: string;
    _action: MsgAction;
    _status: MsgStatus;
    _type: MsgType;
    _task?: MsgTask;
    _entity: MsgEntity;
    _entityType: MsgEntityType;
    _data: _DataI | object = {};
    // _public_client_id: string;
    constructor({ uuid, action, status, type, task, entity, entityType, data = {} }: _ObservableI) {
        // this._public_client_id = config.public_client_id;
        this.uuid = uuid
        this.action = action
        this.status = status
        this.type = type
        this.task = task
        this.data = data
        this.entity = entity
        this.entityType = entityType
    }

    set uuid(uuid: string) {
        this._uuid = uuid && uuid.length > 0 ? uuid : uuidv4();
    }
    get uuid(): string {
        return this._uuid;
    }

    // TODO: throw error if action, status, or type are not valid
    set action(action: MsgAction) {
        this._action = action
    }
    get action(): MsgAction {
        return this._action;
    }
    set status(status: MsgStatus) {
        this._status = status
    }
    get status(): MsgStatus {
        return this._status;
    }
    set type(type: MsgType) {
        this._type = type
    }
    get type(): MsgType {
        return this._type;
    }
    set task(task: MsgTask | undefined) {
        this._task = task
    }
    get task(): MsgTask | undefined {
        return this._task;
    }
    set data(data: object) {
        this._data = data
    }
    get data(): object {
        return this._data;
    }
    set entity(entity: MsgEntity) {
        this._entity = entity;
    }
    get entity(): MsgEntity {
        return this._entity;
    }
    set entityType(entityType: MsgEntityType) {
        this._entityType = entityType;
    }
    get entityType(): MsgEntityType {
        return this._entityType;
    }

    toJSON() {
        return {
            uuid: this.uuid,
            msg_action: this.action,
            msg_status: this.status,
            msg_type: this.type,
            task: this.task,
            data: this.data,
            entity: this.entity,
            entityType: this.entityType
        }
    }

}

