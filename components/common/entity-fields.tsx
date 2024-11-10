import { Character, Event, Faction, TimePeriod, Location, Item, } from '@/types/core'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { formatHistoricalDate, validateHistoricalDate, validateDateRange } from '@/lib/date-utils'
import { DateFormatHelper } from '@/lib/form-helper'
import { cn } from '@/lib/utils'
import React from 'react'

interface DateRangeInputsProps {
  value: Event['date'] | TimePeriod['date']
  onChange: (date: Event['date'] | TimePeriod['date']) => void
}

const DateRangeInputs: React.FC<DateRangeInputsProps> = React.memo(({ value, onChange }) => {
  const handleDateChange = (field: 'start' | 'end', inputValue: string) => {
    const formattedDate = formatHistoricalDate(inputValue)
    const newDate = { ...value, [field]: formattedDate }
    onChange(newDate)
  }

  const isInvalidRange = value.start && value.end && !validateDateRange(value.start, value.end)
  const showStartError = !validateHistoricalDate(value.start) && value.start && value.start.length >= 4
  const showEndError = !validateHistoricalDate(value.end || '') && value.end && value.end.length >= 4

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="text"
            value={value.start}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue === '' || /^-?\d*(?:-(?:0?[1-9]|1[0-2])?(?:-(?:0?[1-9]|[12]\d|3[01])?)?)?$/.test(newValue)) {
                onChange({ ...value, start: newValue });
              }
            }}
            onBlur={(e) => handleDateChange('start', e.target.value)}
            placeholder="e.g., -1200 or 1300-12-25"
            className={cn(showStartError ? 'border-destructive' : '')}
          />
        </div>
        <div>
          <Input
            type="text"
            value={value.end || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue === '' || /^-?\d*(?:-(?:0?[1-9]|1[0-2])?(?:-(?:0?[1-9]|[12]\d|3[01])?)?)?$/.test(newValue)) {
                onChange({ ...value, end: newValue });
              }
            }}
            onBlur={(e) => handleDateChange('end', e.target.value)}
            placeholder={`e.g., ${value.start ? parseInt(value.start) + 100 : '-1100 or 1300-12-25'}`}
            className={cn(
              showEndError ? 'border-destructive' : '',
              isInvalidRange ? 'border-destructive' : ''
            )}
          />
        </div>
      </div>
      <DateFormatHelper />
      {isInvalidRange && (
        <p className="text-xs text-destructive">
          End date must be after start date
        </p>
      )}
    </div>
  )
})
DateRangeInputs.displayName = 'DateRangeInputs'

export const CharacterFields = ({ entity, onChange }: { entity: Character, onChange: (updates: Partial<Character>) => void }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Biography</label>
        <Textarea 
          value={entity.biography ?? ''}
          onChange={(e) => onChange({ biography: e.target.value })}
          className="min-h-[200px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Age</label>
          <Input 
            type="number"
            min={0}
            value={entity.age ?? ''}
            onChange={(e) => onChange({ age: Math.max(0, parseInt(e.target.value)) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Immortal</label>
          <div className="h-10 flex items-center">
            <Switch
              checked={entity.immortal}
              onCheckedChange={(checked) => onChange({ immortal: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const EventFields = ({ entity, onChange }: { entity: Event, onChange: (updates: Partial<Event>) => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={entity.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <DateRangeInputs 
          value={entity.date}
          onChange={(date) => onChange({ date })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Consequences</label>
        <div className="flex flex-col gap-2">
          {entity.consequences?.map((consequence, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={consequence}
                onChange={(e) => {
                  const newConsequences = [...(entity.consequences || [])]
                  newConsequences[index] = e.target.value
                  onChange({ consequences: newConsequences })
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newConsequences = [...(entity.consequences || [])].filter((_, i) => i !== index)
                  onChange({ consequences: newConsequences })
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ consequences: [...(entity.consequences || []), ''] })}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            + Add consequence
          </button>
        </div>
      </div>
    </div>
  )
}

export const FactionFields = ({ entity, onChange }: { entity: Faction, onChange: (updates: Partial<Faction>) => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={entity.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Influence (1-10)</label>
        <Input 
          type="number"
          min={1}
          max={10}
          value={entity.influence ?? 5}
          onChange={(e) => onChange({ 
            influence: Math.min(10, Math.max(1, Number(e.target.value))) 
          })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Beliefs</label>
        <Input 
          value={Array.isArray(entity.beliefs) ? entity.beliefs.join(', ') : ''}
          onChange={(e) => onChange({
            beliefs: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })}
          placeholder="Honor, Justice, Power..."
        />
      </div>
    </div>
  )
}

export const TimePeriodFields = ({ entity, onChange }: { entity: TimePeriod, onChange: (updates: Partial<TimePeriod>) => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={entity.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <DateRangeInputs 
          value={entity.date}
          onChange={(date) => onChange({ date })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Major Changes</label>
        <Input 
          value={Array.isArray(entity.majorChanges) ? entity.majorChanges.join(', ') : ''}
          onChange={(e) => onChange({
            majorChanges: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })}
          placeholder="Rise of Magic, Fall of Empire..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cultural Characteristics</label>
        <Input 
          value={Array.isArray(entity.culturalCharacteristics) ? entity.culturalCharacteristics.join(', ') : ''}
          onChange={(e) => onChange({
            culturalCharacteristics: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })}
          placeholder="Renaissance Art, Scientific Discovery..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Technological Level</label>
        <Input 
          value={entity.technologicalLevel}
          onChange={(e) => onChange({ technologicalLevel: e.target.value })}
          placeholder="Medieval, Industrial, Magic-based..."
        />
      </div>
    </div>
  )
}

export const LocationFields = ({ entity, onChange }: { entity: Location, onChange: (updates: Partial<Location>) => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={entity.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Climate</label>
          <Input 
            value={entity.climate || ''}
            onChange={(e) => onChange({ climate: e.target.value })}
            placeholder="Tropical, Arctic, etc."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Culture</label>
          <Input 
            value={entity.culture || ''}
            onChange={(e) => onChange({ culture: e.target.value })}
            placeholder="Medieval European, etc."
          />
        </div>
      </div>

      {entity.coordinates && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">X Coordinate</label>
            <Input 
              type="number"
              value={entity.coordinates.x}
              onChange={(e) => onChange({
                coordinates: { ...entity.coordinates!, x: Number(e.target.value) }
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Y Coordinate</label>
            <Input 
              type="number"
              value={entity.coordinates.y}
              onChange={(e) => onChange({
                coordinates: { ...entity.coordinates!, y: Number(e.target.value) }
              })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const ItemFields = ({ entity, onChange }: { entity: Item, onChange: (updates: Partial<Item>) => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={entity.description ?? ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">History</label>
        <Textarea 
          value={entity.history}
          onChange={(e) => onChange({ history: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Powers</label>
        <Input 
          value={Array.isArray(entity.powers) ? entity.powers.join(', ') : ''}
          onChange={(e) => onChange({
            powers: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })}
          placeholder="Fire, Ice, Wind..."
        />
      </div>
    </div>
  )
}