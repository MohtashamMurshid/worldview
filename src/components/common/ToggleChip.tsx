interface ToggleChipProps {
  label: string
  active: boolean
  onToggle: () => void
}

export const ToggleChip = ({ label, active, onToggle }: ToggleChipProps) => (
  <button className={`hud-chip ${active ? 'active' : ''}`} onClick={onToggle}>
    {label}
  </button>
)
