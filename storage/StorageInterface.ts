import { Entity, Relation, KnowledgeGraph } from '../types.js';

/**
 * Common interface for storage managers
 */
export interface StorageManager {
  createEntities(entities: Entity[]): Promise<Entity[]>;
  createRelations(relations: Relation[]): Promise<Relation[]>;
  addObservations(observations: { entityName: string; contents: string[] }[]): Promise<{ entityName: string; addedObservations: string[] }[]>;
  deleteEntities(entityNames: string[]): Promise<void>;
  deleteObservations(deletions: { entityName: string; observations: string[] }[]): Promise<void>;
  deleteRelations(relations: Relation[]): Promise<void>;
  readGraph(): Promise<KnowledgeGraph>;
  searchNodes(query: string): Promise<KnowledgeGraph>;
  openNodes(names: string[]): Promise<KnowledgeGraph>;
}