import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { MoveHorizontal, Pencil, Trash2 } from "lucide-react"
import { UUID } from "@/types/core"

interface LocationContextMenuProps {
  children: React.ReactNode
  locationId: UUID
  markerId?: UUID
  onEdit: (locationId: UUID) => void
  onMove?: (markerId: UUID) => void
  onRemove?: (markerId: UUID) => void
}

export function LocationContextMenu({
  children,
  locationId,
  markerId,
  onEdit,
  onMove,
  onRemove
}: LocationContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onEdit(locationId)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Location
        </ContextMenuItem>
        {markerId && onMove && (
          <ContextMenuItem onClick={() => onMove(markerId)}>
            <MoveHorizontal className="mr-2 h-4 w-4" />
            Move Marker
          </ContextMenuItem>
        )}
        {markerId && onRemove && (
          <ContextMenuItem
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onRemove(markerId)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Marker
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
} 