
import { v4 as uuidv4 } from 'uuid';
import { MsgAction, MsgStatus, MsgType, MsgTask, MsgEntity, MsgEntityType } from '../enums';
import config from 'data/api/config';

export interface _ObservableI {
  uuid: string
  msg_action: MsgAction
  msg_status: MsgStatus
  msg_type: MsgType
  task?: MsgTask;
  entity?: MsgEntity
  entityType?: MsgEntityType;
  data?: object

}

export class _Observable implements _ObservableI {
  _uuid: string;
  _action: MsgAction;
  _status: MsgStatus;
  _type: MsgType;
  _task?: MsgTask;
  _entity?: MsgEntity;
  _entityType?: MsgEntityType;
  _data: object;
  // _public_client_id: string;
  constructor({ uuid, msg_action, msg_status, msg_type, task, entity, entityType, data = {} }: _ObservableI) {
    // this._public_client_id = config.public_client_id;
    this.uuid = uuid
    this.action = msg_action
    this.status = msg_status
    this.type = msg_type
    this.task = task
    this.data = data
    this.entity = entity
    this.entityType = entityType
  }

  set uuid(uuid: string) {
    this._uuid = uuid && uuid.length > 0 ? uuid : uuidv4();
    // console.log(this._uuid);
  }
  get uuid(): string {
    return this._uuid;
  }
  // get public_client_id(): string {
  //   return this._public_client_id;
  // }
  // TODO: throw error if action, status, or type are not valid
  set action(action: MsgAction) {
    this._action = action
  }
  set msg_action(action: MsgAction) {
    this._action = action
  }
  get action(): MsgAction {
    return this._action;
  }

  set status(status: MsgStatus) {
    this._status = status
  }
  set msg_status(status: MsgStatus) {
    this._status = status
  }
  get status(): MsgStatus {
    return this._status;
  }

  set type(type: MsgType) {
    this._type = type
  }
  set msg_type(type: MsgType) {
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
      // public_client_id: this.public_client_id,
      uuid: this.uuid,
      action: this.action,
      status: this.status,
      type: this.type,
      data: this.data,
      entity: this.entity,
    }
  }

}

