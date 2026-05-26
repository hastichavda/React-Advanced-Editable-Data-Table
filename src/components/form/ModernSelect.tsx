import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import { useClickOutside } from '../../hooks/useClickOutside'
import { useEscapeToClose } from '../../hooks/useEscapeToClose'

export interface SelectOption {
  label: string
  value: string
}

interface ModernSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  ariaLabel: string
  disabled?: boolean
  className?: string
  size?: 'default' | 'compact'
  onEnterKey?: () => void
  onEscapeKey?: () => void
}

export const ModernSelect = ({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  disabled = false,
  className,
  size = 'default',
  onEnterKey,
  onEscapeKey,
}: ModernSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useClickOutside(wrapperRef, closeMenu, isOpen)
  useEscapeToClose(closeMenu, isOpen)

  const handleTriggerClick = (): void => {
    if (!disabled) {
      setIsOpen((open) => !open)
    }
  }

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter' && onEnterKey) {
      event.preventDefault()
      onEnterKey()
      return
    }

    if (event.key === 'Escape' && onEscapeKey) {
      event.preventDefault()
      closeMenu()
      onEscapeKey()
    }
  }

  const classNames = [
    'modern-select',
    size === 'compact' ? 'modern-select--compact' : '',
    isOpen ? 'is-open' : '',
    disabled ? 'is-disabled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={wrapperRef} className={classNames}>
      <button
        type="button"
        className="modern-select__trigger"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <span className="modern-select__label">
          {selectedOption?.label ?? placeholder ?? 'Select option'}
        </span>
        <span className="modern-select__chevron" aria-hidden>
          ▼
        </span>
      </button>

      <ul
        className={`modern-select__menu ${isOpen ? 'is-open' : ''}`}
        role="listbox"
        hidden={!isOpen}
      >
        {options.map((option) => {
          const isSelected = option.value === value

          return (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isOpen ? 0 : -1}
                className={`modern-select__option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  closeMenu()
                }}
              >
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
