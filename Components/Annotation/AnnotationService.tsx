import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { action, reaction, makeObservable, observable, computed, when } from "mobx";
// import { observer } from 'mobx-react';
import { EntityStore } from "./EntityStore";
import { LabelStore } from "./LabelStore";
import { TokenStore } from "./TokenStore";
import { IOService } from "../../data";
import PaginationSvc from './PaginationService';
import {
    Entity,
    Change,
    Doc,
    Revisions,
    MsgEntity,
    _Obs_Request,
    _Obs_Response,
    MsgAction,
    MsgStatus,
    MsgType,
    MsgEntityType,
    MsgTask
} from "../../data/api/types";
export class AnnotationService {
    private _ioService: IOService;
    paginationSvc: PaginationSvc;
    @observable documentStores: Map<string, { entityStore: EntityStore, tokenStore: TokenStore }>;
    @observable currentDocumentId: string | null = null;

    @observable selectedLabelId: string | null = null;
    @observable selectedIndices: Set<number> = new Set();
    @observable isLoading: boolean = true;

    labelStore: LabelStore;

    changes: Change[] = [];

    constructor(docId: string) {
        this.paginationSvc = new PaginationSvc(MsgEntity.doc, MsgTask.deid);
        this._ioService = IOService.getInstance();
        this._ioService.subscribe(MsgEntity.doc, this._onMessage);
        this.labelStore = LabelStore.getInstance();
        makeObservable(this);
        this.documentStores = new Map();
        this.init(docId);
    }
    async init(id: string) {
        when(() => (this.labelStore.isLoaded && this.paginationSvc.isLoaded), () => {
            const currentId = this.paginationSvc.currentId;
            // this.loadDocumentById(docId);
            this.loadDocumentById(currentId);
        });
    }

    loadDocument(msg: _Obs_Response) {
        // @ts-ignore
        this.addDocument(msg.data.docs[0]);
    }

    @action
    async loadDocumentById(id: string) {
        const req = await this._ioService.send(
            new _Obs_Request({
                action: MsgAction.read,
                status: MsgStatus.loading,
                type: MsgType.data,
                task: MsgTask.deid,
                entity: MsgEntity.doc,
                entityType: MsgEntityType.deid,
                data: {
                    item_ids: [id],
                },
            })
        );

        this.addDocument(req.data.items[0]);
        // TODO: move to init
        this.setIsLoading(false);
    }

    @action setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @action addDocument(doc: Doc) {
        const { uuid, entities, tokens } = doc;
        const entityStore = new EntityStore(this.labelStore);
        //@ts-ignore
        entities.forEach(entityStore.addEntity);
        const tokenStore = new TokenStore();
        //@ts-ignore
        tokenStore.addTokens(tokens);
        this.documentStores.set(uuid, { entityStore, tokenStore });
        this.currentDocumentId = uuid;
    }

    _onMessage(msg: _Obs_Response) {
        console.log(`annotation service recieved ${msg}`);
    }

    @action.bound setSelectedLabelId(id: string) {
        this.selectedLabelId = id.replace(/.*?([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}).*/gi, '$1');
        this.createEntity();
    }

    @action.bound setSelectedIndices(indices: string[]) {
        this.selectedIndices = new Set(indices.map(Number));
    }

    @action.bound createEntity(labelId?: string, tokenIndices?: number[]) {
        labelId = labelId || this.selectedLabelId;
        tokenIndices = tokenIndices || [...this.selectedIndices];

        if (!labelId || !tokenIndices.length) return;

        const entityStore = this.getCurrentEntityStore();
        const start = Math.min(...tokenIndices);
        const end = Math.max(...tokenIndices);
        const [start_char, end_char] = this.getCurrentTokenStore().getCharactersByTokenRange(start, end);
        const entity = entityStore.createEntity(this.selectedLabelId, start, end, start_char, end_char);
        this.trackChange(entity, MsgAction.create, MsgEntity.entity);
    }

    trackChange(changedObj: any, action: MsgAction, entity: MsgEntity) {
        const change = new Change(
            changedObj,
            action,
            entity,
        );
        this.changes.push(change);
    }

    @action.bound setCurrentDocumentId(id: string) {
        this.currentDocumentId = id;
        console.log(`anno service current doc id: ${id}`);
    }

    deleteEntity(entityId: string) {
        const entity = this.getCurrentEntityStore().deleteEntity(entityId);
        this.trackChange(entity, MsgAction.delete, MsgEntity.entity);
        return entity;
    }

    updateEntity(entity: Entity) {
        const newEntity = this.getCurrentEntityStore().updateEntity(entity);
        this.trackChange(newEntity, MsgAction.update, MsgEntity.entity);
        return newEntity;
    }

    @computed get entities() {
        return this.getCurrentEntityStore().entities;
    }

    getEntity(entityId: string) {
        return this.getCurrentEntityStore().getEntity(entityId);
    }

    @computed get tokens() {
        return this.getCurrentTokenStore().tokens;
    }

    getToken(tokenId: string) {
        return this.getCurrentTokenStore().getToken(tokenId);
    }

    getCurrentTokenStore() {
        return this.getCurrentDocumentStore().tokenStore;
    }

    getTokensInRange(start: number, end: number) {
        return this.getCurrentTokenStore().getTokensInRange(start, end);
    }

    getEntitiesByRange(start: number, end: number) {
        return this.getCurrentEntityStore().getEntitiesByRange(start, end);
    }

    get overlappingEntities() {
        return this.getCurrentEntityStore().overlappingEntities;
    }

    getEntityOrder(entityId: string) {
        return this.getCurrentEntityStore().getEntityOrder(entityId);
    }

    private getCurrentEntityStore() {
        return this.getCurrentDocumentStore().entityStore;
    }

    private getCurrentDocumentStore() {
        if (this.currentDocumentId && this.documentStores.has(this.currentDocumentId)) {
            return this.documentStores.get(this.currentDocumentId);
        }
        return null;
    }

    get labels() {
        return this.labelStore.getLabels({});
    }
    getLabelById(labelId: string) {
        return this.labelStore.getLabelById(labelId);
    }
    // returns labels organized by category
    @computed get labelsByCategory() {
        return this.labelStore.getAllLabelsByCategory({ task: 'deID' });
    }

    @action.bound submitAnnotation() {
        const revisions = new Revisions({
            docID: this.currentDocumentId,
            changes: this.changes,
            authorID: 'fake_user_id',
        });

        this._ioService.send(new _Obs_Request({
            action: MsgAction.create,
            status: MsgStatus.loading,
            type: MsgType.data,
            task: MsgTask.deid,
            entity: MsgEntity.annotation,
            entityType: MsgEntityType.deid,
            //@ts-ignore
            data: {
                items: [revisions],
                item_ids: [revisions.uuid],
            },
        }));
        // TODO: handle response
        // console.log(doc.uuid);
    }

}

const AnnotationSvcContext = createContext<AnnotationService | null>(null);

type AnnotationProviderProps = {
    docId: string;
    children: React.ReactNode;
};

function AnnotationSvcProvider({ docId, children }: AnnotationProviderProps) {
    const store = new AnnotationService(docId);

    return (
        <AnnotationSvcContext.Provider value={store}>
            {children}
        </AnnotationSvcContext.Provider>
    );
}

const useAnnotationService = (): AnnotationService => {
    const store = useContext(AnnotationSvcContext);
    if (!store) {
        throw new Error('useAnnotationService must be used within a AnnotationProvider');
    }
    return store;
}

export { AnnotationSvcProvider, useAnnotationService };