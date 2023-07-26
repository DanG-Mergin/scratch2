
import { observable, action, computed, makeObservable } from 'mobx';
import { IOService } from "../../data";
import { MsgEntityType, MsgEntity, _Obs_Request, _Obs_Response, MsgAction, MsgStatus, MsgType, MsgTask, Label, LabelI } from "../../data/api/types";

export class LabelStore {
  private _ioService: IOService;
  @observable labels: Map<string, LabelI> = new Map();
  @observable isLoaded: boolean = false;

  private static instance: LabelStore;

  private constructor() {
    this._ioService = IOService.getInstance();
    // TODO: unsubscribe when destroyed
    this._ioService.subscribe(MsgEntity.doc, this._onMessage);
    makeObservable(this);
    this.fetchLabels();
  }

  // TODO: tasks are hardcoded for now
  // static getInstance(task: MsgTask): LabelStore {
  static getInstance(): LabelStore {
    if (!LabelStore.instance) {
      LabelStore.instance = new LabelStore();
    }
    return LabelStore.instance;
  }

  @action setIsLoaded(isLoaded: boolean) {
    this.isLoaded = isLoaded;
  }
  _onMessage(msg: _Obs_Response) {
    console.log(`label store recieved observable push ${msg}`);
  }

  @action.bound async fetchLabels() {
    this.setIsLoaded(false)
    const req = await this._ioService.send(new _Obs_Request({
      action: MsgAction.read,
      status: MsgStatus.loading,
      type: MsgType.data,
      entity: MsgEntity.label,
      task: MsgTask.deid, // TODO: hardcoded for now
      entityType: MsgEntityType.dictionary,
      data: {}
    }));
    console.log(`label store fetched ${req}`);

    const labels = req.data.items;
    for (const label of labels) {
      this.addLabel(new Label(label));
    }
    this.setIsLoaded(true)
  }

  @action.bound addLabel(label: LabelI) {
    this.labels.set(label.uuid, label);
  }

  @action.bound deleteLabel(labelId: string) {
    this.labels.delete(labelId);
  }

  @action.bound updateLabel(label: LabelI) {
    this.labels.set(label.uuid, label);
  }

  getLabels({ type, task }: { type?: string, task?: string }) {
    if (type && !task) {
      return Array.from(this.labels.values()).filter(label => label.types.includes(type));
    } else if (type && task) {
      return Array.from(this.labels.values())
        .filter(label => label.types.includes(type) && label.tasks.includes(task));
    } else if (!type && task) {
      return Array.from(this.labels.values()).filter(label => label.tasks.includes(task));
    }
    return Array.from(this.labels.values());
  }
  // returns labels organized by category
  getAllLabelsByCategory({ type, task }: { type?: string, task?: string }) {
    const categories = this.getLabels({ type, task })
      .map(label => label.category);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories.map(category => {
      let labels = this.getLabelsByCategory(category);
      //   const generic = labels.find(label => label.subcategory === 'OTHER');
      //   if (labels.length < 2) { labels = []; }
      //   else labels = labels.filter(label => label.subcategory !== 'OTHER');
      const generic = labels.find(label => label.subcategory === label.category);
      if (labels.length < 2) { labels = []; }
      else labels = labels.filter(label => label.subcategory !== label.category);

      return {
        category,
        generic,
        specific: labels,
      }
    });
  }

  getLabelsByCategory(category: string) {
    return Array.from(this.labels.values()).filter(label => label.category === category);
  }

  getLabelById(labelId: string) {
    return this.labels.get(labelId);
  }
}