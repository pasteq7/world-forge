export const DateFormatHelper = () => (
  <p className="text-xs text-muted-foreground mt-1">
    Format: YYYY or YYYY-MM-DD
    <br />
    <span>
      • Use negative years for BCE dates (e.g., -1200 for 1200 BCE)
      <br />
      • Partial dates allowed (e.g., 1200 or 1200-12)
    </span>
  </p>
); 