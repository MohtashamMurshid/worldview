interface RangeFieldProps {
  label: string
  min: number
  max: number
  step?: number
  value: number
  valueSuffix?: string
  onChange: (value: number) => void
}

export const RangeField = ({
  label,
  min,
  max,
  step,
  value,
  valueSuffix,
  onChange,
}: RangeFieldProps) => (
  <div className="range-field">
    {label ? <span>{label}</span> : null}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <small>
      {value}
      {valueSuffix ? ` ${valueSuffix}` : ''}
    </small>
  </div>
)
