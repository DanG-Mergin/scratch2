import { observable, action, computed } from 'mobx';
import config from "../api/config";
import { _Observable as _Obs_Request, _Observable } from "../api/types/requests";
import { _Observable as _Obs_Response } from "../api/types/responses";
import { MsgEntity } from "../api/types";


interface QueueItem {
    request: _Obs_Request;
    resolve: (data: any) => void;
    reject: (error: Error) => void;
}

interface CallbackMap {
    [key: string]: ((data: any) => void)[];
}

export class IOService {
    private static instance: IOService;
    private _url: string;
    private ws!: WebSocket;
    private queue: Map<string, QueueItem> = new Map();
    private callbackMap: CallbackMap = Object.values(MsgEntity)
        .reduce((obj, entity) => ({ ...obj, [entity]: [] }), {});

    @observable
    private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';

    private constructor(url: string) {
        this._url = url;
        this.connect();
    }

    static getInstance(): IOService {
        if (!IOService.instance) {
            IOService.instance = new IOService(config.paths.ws_url);
        }
        return IOService.instance;
    }

    @computed
    get isConnected() {
        return this.connectionStatus === 'connected';
    }

    @computed
    get isConnecting() {
        return this.connectionStatus === 'connecting';
    }

    @computed
    get isDisconnected() {
        return this.connectionStatus === 'disconnected';
    }

    private connect() {
        this.connectionStatus = 'connecting';
        this.ws = new WebSocket(this._url);
        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onmessage = this.onMessage;
    }

    @action
    private onOpen = () => {
        this.connectionStatus = 'connected';
        this.processQueue();
    };

    @action
    private onClose = () => {
        this.connectionStatus = 'disconnected';
        setTimeout(() => this.connect(), 1000);
    };

    private onMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        const obs = new _Obs_Response(JSON.parse(event.data));
        const entity = obs.entity;

        const queueItem = this.queue.get(obs.uuid);
        if (queueItem) {
            this.queue.delete(obs.uuid);
            if (queueItem.request.uuid !== obs.uuid) {
                //@ts-ignore
                this.broadcast(entity, obs);
            }
            queueItem.resolve(obs);
        }
    };

    private processQueue() {
        this.queue.forEach(item => {
            this.ws.send(JSON.stringify(item.request));
        });
    }

    private enqueue(request: _Obs_Request): Promise<any> {
        return new Promise((resolve, reject) => {
            const queueItem = { request, resolve, reject };
            this.queue.set(request.uuid, queueItem);
            if (this.isConnected) {
                this.processQueue();
            }
        });
    }

    public send(req: _Obs_Request): Promise<any> {
        return this.enqueue(req);
    }

    // TODO: need a truly uncoupled emitter
    public subscribe(entity: MsgEntity, callback: (data: any) => void) {
        this.callbackMap[entity].push(callback);
    }

    public unsubscribe(entity: MsgEntity, callback: (data: any) => void) {
        const callbacks = this.callbackMap[entity];
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    public broadcast(entity: MsgEntity, msg: _Observable) {
        if (this.callbackMap[entity] && this.callbackMap[entity].length) {
            this.callbackMap[entity].forEach(callback => callback(msg));
        }
    }
}