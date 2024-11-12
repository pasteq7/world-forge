import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { WorldEntity, UUID, EntityType, isCharacter, isLocation, isTimePeriod, isFaction, isItem, isEvent, SubTypes, SubTypeValues } from '@/types/core'
import { useState, useCallback } from 'react'
import { useWorldStore } from '@/store/world-store'
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import RelationshipsContent from './relationships-tab'
import { CharacterFields, LocationFields, EventFields, ItemFields, FactionFields, TimePeriodFields } from './entity-fields'

interface EntitySheetProps {
  entityId: UUID
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TagInput({ value, onChange }: { 
  value: string[], 
  onChange: (tags: string[]) => void 
}) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <span 
            key={tag} 
            className="bg-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter..."
      />
    </div>
  )
}

type EntityUpdates<T extends WorldEntity> = Partial<Omit<T, 'type' | 'id'>>;

export function EntitySheet({ entityId, open, onOpenChange }: EntitySheetProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const entity = useWorldStore(
    useCallback(state => state.getEntity(entityId), [entityId])
  )
  const updateEntity = useWorldStore(
    useCallback(state => state.updateEntity, [])
  )
  const deleteEntity = useWorldStore(
    useCallback(state => state.deleteEntity, [])
  )

  const handleTypeSpecificChange = useCallback(<T extends WorldEntity>(updates: Partial<T>) => {
    updateEntity(entityId, {
      ...updates,
      updatedAt: new Date()
    });
  }, [entityId, updateEntity]);

  const handleBasicChange = <T extends WorldEntity>(updates: EntityUpdates<T>) => {
    updateEntity(entityId, {
      ...updates,
      updatedAt: new Date()
    });
  };

  const handleDelete = () => {
    try {
      deleteEntity(entityId)
      toast.success("Entity deleted successfully")
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting entity:', error)
      toast.error("Failed to delete entity")
    }
  }

  const handleSubTypeChange = (newSubType: string) => {
    updateEntity(entityId, {
      subType: newSubType as SubTypeValues<EntityType>,
      updatedAt: new Date()
    });
  };

  const renderEntityFields = () => {
    if (!entity) return null;
    
    if (isCharacter(entity)) {
      return <CharacterFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    if (isEvent(entity)) {
      return <EventFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    if (isLocation(entity)) {
      return <LocationFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    if (isItem(entity)) {
      return <ItemFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    if (isFaction(entity)) {
      return <FactionFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    if (isTimePeriod(entity)) {
      return <TimePeriodFields entity={entity} onChange={handleTypeSpecificChange} />;
    }
    return null;
  };

  if (!entity) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[1280px] h-full flex flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 p-6 pb-2">
          <SheetTitle className="text-xl">
            {entity.name || `New ${entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}`}
          </SheetTitle>
        </SheetHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="shrink-0 px-6">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:border-b-2 rounded-none h-full px-4"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="relationships" 
                className="data-[state=active]:border-b-2 rounded-none h-full px-4"
              >
                Relationships
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent 
              value="details" 
              className="h-full mt-0 data-[state=active]:flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 pt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={entity.subType}
                        onChange={(e) => handleSubTypeChange(e.target.value)}
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      >
                        {Object.entries(SubTypes[entity.type]).map(([key, value]) => (
                          <option key={key} value={value}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input 
                        value={entity.name}
                        onChange={(e) => handleBasicChange({ name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Summary</label>
                    <Textarea 
                      value={entity.summary}
                      onChange={(e) => handleBasicChange({ summary: e.target.value })}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <TagInput 
                      value={entity.tags}
                      onChange={(tags) => handleBasicChange({ tags })}
                    />
                  </div>

                  {renderEntityFields()}
                </div>
              </div>
            </TabsContent>

            <TabsContent 
              value="relationships" 
              className="h-full mt-0 data-[state=active]:flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 pt-4">
                <RelationshipsContent entity={entity} />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <SheetFooter className="shrink-0 p-6 pt-4 border-t">
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {entity.type}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {entity.name || `this ${entity.type}`}
                  and remove all associated relationships.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}