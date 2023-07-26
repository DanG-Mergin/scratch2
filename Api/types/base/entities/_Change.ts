import { MsgAction } from "../../enums";
import { v4 as uuidv4 } from 'uuid';

export class Change {
  private name = "change";
  public uuid?: string;
  public action: MsgAction;
  public entity: string;
  public timestamp: Date;
  public object: any;

  constructor(object: any, action: MsgAction, entity: string, uuid?: string) {
    this.uuid = uuid ? uuid : `rev_${uuidv4()}`;
    this.action = action;
    this.entity = entity;
    // should be UTC
    this.timestamp = new Date();
    this.object = object;
  }
}