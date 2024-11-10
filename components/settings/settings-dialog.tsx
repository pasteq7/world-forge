"use client"

import { Moon, Sun, Upload, Trash2, FileJson } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useWorldStore } from "@/store/world-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { exportWorldWithMap } from '@/store/world-store'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [showClearDialog, setShowClearDialog] = useState(false)

  const isCurrentlyDark = resolvedTheme === "dark"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Appearance</h3>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setTheme(isCurrentlyDark ? "light" : "dark")}
            >
              <div className="flex items-center gap-2">
                {isCurrentlyDark ? <Sun /> : <Moon />}
                <span>{isCurrentlyDark ? "Light Mode" : "Dark Mode"}</span>
              </div>
            </Button>
          </div>

          <Separator />

          {/* Data Management Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => exportWorldWithMap()}
              >
                <div className="flex items-center gap-2">
                  <FileJson />
                  <span>Export World Data</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      const text = await file.text()
                      useWorldStore.getState().importWorld(text)
                    }
                  }
                  input.click()
                }}
              >
                <div className="flex items-center gap-2">
                  <Upload />
                  <span>Import World Data</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-500"
                onClick={() => setShowClearDialog(true)}
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  <span>Clear All Data</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your stored data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
} 