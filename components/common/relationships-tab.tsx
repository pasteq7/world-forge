import { WorldEntity, UUID, EntityType } from '@/types/core';
import { useWorldStore } from '@/store/world-store';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RelationTypes  } from '@/types/core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface RelationshipsContentProps {
  entity: WorldEntity;
}

function getEntityTypeLabel(type: EntityType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function RelationshipsContent({ entity }: RelationshipsContentProps) {
  // Use separate selectors for better performance
  const entities = useWorldStore(state => state.entities);
  const relations = useWorldStore(state => state.relations);
  const addEntityRelation = useWorldStore(state => state.addEntityRelation);
  const removeRelation = useWorldStore(state => state.deleteEntityRelation);

  // Memoize filtered data
  const filteredEntities = useMemo(() => 
    entities.filter(e => e.id !== entity.id),
    [entities, entity.id]
  );

  const entityRelations = useMemo(() => 
    relations.filter(r => r.fromId === entity.id),
    [relations, entity.id]
  );

  // Local state with proper UUID type
  const [targetId, setTargetId] = useState<UUID>('' as UUID);
  const [relationType, setRelationType] = useState('');
  const [customRelationType, setCustomRelationType] = useState('');
  const [customInverseType, setCustomInverseType] = useState('');
  const [activeTab, setActiveTab] = useState<EntityType>(EntityType.Character);

  // Get valid relation types based on selected target
  const getValidRelationTypes = useMemo(() => {
    if (!targetId) return [];
    const target = entities.find(e => e.id === targetId);
    if (!target) return [];
    
    return RelationTypes[entity.type]?.[target.type] || [];
  }, [targetId, entity.type, entities]);

  const handleAdd = () => {
    if (!targetId || (!relationType || (relationType === 'custom' && !customRelationType))) return;
    const target = entities.find(e => e.id === targetId);
    if (!target) return;

    // For custom relations, use the same type if no inverse specified
    const inverseType = customInverseType || customRelationType;

    // Add the primary relation
    addEntityRelation(
      entity.id,
      entity.type,
      targetId,
      target.type,
      relationType === 'custom' ? customRelationType : relationType,
      relationType === 'custom' ? {
        inverseType,
        createdAt: new Date().toISOString()
      } : undefined
    );

    // For custom relations, always add the inverse
    if (relationType === 'custom') {
      addEntityRelation(
        targetId,
        target.type,
        entity.id,
        entity.type,
        inverseType,
        {
          createdAt: new Date().toISOString()
        }
      );
    }

    // Reset form
    setTargetId('' as UUID);
    setRelationType('');
    setCustomRelationType('');
    setCustomInverseType('');
  };

  const handleRemove = (fromId: UUID, toId: UUID) => {
    // Find the specific relation to remove
    const relation = relations.find(r => r.fromId === fromId && r.toId === toId);
    if (!relation) return;

    // Remove only this specific relation
    removeRelation(relation.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            value={targetId}
            onValueChange={(value: UUID) => setTargetId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity..." />
            </SelectTrigger>
            <SelectContent>
              <Tabs
                defaultValue={EntityType.Character}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as EntityType)}
                className="w-full"
              >
                <TabsList className="w-full">
                  {Object.values(EntityType).map(type => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="flex-1"
                    >
                      {getEntityTypeLabel(type)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.values(EntityType).map(type => (
                  <TabsContent key={type} value={type} className="mt-2">
                    {filteredEntities
                      .filter(e => e.type === type)
                      .map(e => (
                        <SelectItem key={e.id} value={e.id}>
                          <span className="flex items-center gap-2">
                            <span>{e.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({e.subType})
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </SelectContent>
          </Select>

          <Select 
            value={relationType} 
            onValueChange={setRelationType}
            disabled={!targetId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {getValidRelationTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {relationType === 'custom' && (
          <div className="grid gap-4">
            <input
              type="text"
              value={customRelationType}
              onChange={(e) => setCustomRelationType(e.target.value)}
              placeholder="Enter relation from this entity... (e.g., 'lives in')"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={customInverseType}
              onChange={(e) => setCustomInverseType(e.target.value)}
              placeholder="Enter relation from target entity... (e.g., 'home of')"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}

        <Button 
          onClick={handleAdd} 
          disabled={!targetId || (!relationType || (relationType === 'custom' && !customRelationType))}
          className="w-full"
        >
          Add Relation
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Current Relations</h3>
        {entityRelations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No relations yet</p>
        ) : (
          <div className="grid gap-3">
            {entityRelations.map(relation => {
              const relatedEntity = entities.find(e => e.id === relation.toId);
              return (
                <div 
                  key={relation.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-medium">{relatedEntity?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({getEntityTypeLabel(relation.toType)})
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-sm font-medium">{relation.relationType}</span>
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(relation.fromId, relation.toId)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}