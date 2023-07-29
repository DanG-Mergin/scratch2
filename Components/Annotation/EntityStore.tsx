import { observable, action, computed } from 'mobx';
import { LabelStore } from './LabelStore';
import { makeObservable } from 'mobx';
// import { v4 as uuidv4 } from 'uuid';
import { UserError } from 'components/Notifications/NotificationStore';

import { Entity } from "../../data/api/types";
export class EntityStore {
    @observable entities: Map<string, Entity> = new Map();
    @observable entityMeta: Map<string, any> = new Map();
    labelStore: LabelStore;

    constructor(labelStore: LabelStore) {
        this.labelStore = labelStore;
        makeObservable(this);
    }

    @action.bound addEntity(entity: Entity) {
        // make sure the entity isn't overlapping with another entity of the same category
        const overlapping = this.getEntitiesByRange(entity.startIndex, entity.endIndex);
        if (overlapping.length > 0) {
            overlapping.forEach((e) => {
                if (e.labelId === entity.labelId) {
                    throw new UserError(`Entity overlaps with another entity of the same category`);
                }
            });
        }

        this.entities.set(entity.uuid, observable(entity));
        return entity;
    }

    @action.bound createEntity(labelId: string, startIndex: number, endIndex: number, startChar: number, endChar: number) {
        const label = this.labelStore.getLabelById(labelId);

        const entity = new Entity({
            startIndex,
            endIndex,
            startChar,
            endChar,
            labelId,
            text: label.tag
        });
        return this.addEntity(entity);
    }

    @action.bound deleteEntity(entityId: string) {
        const entity = this.getEntity(entityId);
        this.entities.delete(entityId);
        return entity;
    }

    @action.bound updateEntity(entity: Entity) {
        this.entities.set(entity.uuid, observable(entity));
        return this.getEntity(entity.uuid);
    }

    @computed get sortedEntities(): Entity[] {
        let sorted: Entity[] = Array.from(this.entities.values());
        sorted.sort((a, b) => {
            if (a.startIndex < b.startIndex) {
                return -1;
            } else if (a.startIndex > b.startIndex) {
                return 1;
            } else {
                // If startIndexes are equal, compare ranges 
                let range1 = a.endIndex - a.startIndex;
                let range2 = b.endIndex - b.startIndex;
                if (range1 < range2) {
                    return -1;
                } else if (range1 > range2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return sorted;
    }

    @computed get overlappingEntities() {
        // let sorted = Array.from(this.entities.values()).sort((a, b) => a.startIndex - b.startIndex);
        let sorted = this.sortedEntities;
        // let groups = [];
        const groups = new Map();
        let maxEnd = -Infinity;

        for (let i = 0, currentGroup = []; i < sorted.length; i++) {
            let obj = sorted[i];

            if (obj.endIndex > maxEnd) {
                maxEnd = obj.endIndex;
            }

            if (i === sorted.length - 1 || maxEnd < sorted[i + 1].startIndex) {
                // If the current object doesn't overlap with the next object, add the current group to the groups map
                currentGroup.push(obj);
                groups.set(
                    currentGroup[0].startIndex,
                    {
                        entities: currentGroup,
                        startIndex: currentGroup[0].startIndex,
                        endIndex: maxEnd
                    });
                currentGroup = [];
                maxEnd = -Infinity;
            } else {
                // If the current object overlaps with the next object, add it to the current group
                currentGroup.push(obj);
            }
        }

        return groups;
    }

    @computed get entityMetaMap() {
        const entityMeta = new Map();

        for (const [entStartIdx, group] of this.overlappingEntities) {
            group.entities.forEach((entity: Entity) => {
                entityMeta.set(entity.uuid, {
                    order: group.entities.indexOf(entity),
                    groupStartIndex: group.startIndex,
                    groupEndIndex: group.endIndex,
                });
            });
        };

        return entityMeta;
    }

    getEntitiesByRange(startIndex: number, endIndex: number) {
        endIndex = endIndex ? endIndex : startIndex;
        const entityGroups = this.overlappingEntities;
        const entities: Entity[] = [];

        for (const [entStartIdx, group] of entityGroups) {
            if (entStartIdx > endIndex) {
                return entities;
            }
            if (startIndex >= group.startIndex && endIndex <= group.endIndex) {
                entities.push(...group.entities);
            }
        };

        return entities;
    }

    getEntityOrder(entityId: string) {
        // order is relative to the number of overlapping entities
        return this.entityMetaMap.get(entityId).order;
    }

    getEntity(entityId: string) {
        return this.entities.get(entityId);
    }
}