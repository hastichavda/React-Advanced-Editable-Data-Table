import { useCallback, useRef, useState, type ReactNode } from 'react'

import { useClickOutside } from '../../hooks/useClickOutside'
import { useEscapeToClose } from '../../hooks/useEscapeToClose'

interface DropdownMenuProps {
  triggerLabel: string
  children: ReactNode
  ariaLabel: string
  align?: 'left' | 'right'
}

export const DropdownMenu = ({
  triggerLabel,
  children,
  ariaLabel,
  align = 'right',
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useClickOutside(wrapperRef, closeMenu, isOpen)
  useEscapeToClose(closeMenu, isOpen)

  return (
    <div ref={wrapperRef} className="modern-dropdown">
      <button
        type="button"
        className={`modern-dropdown__trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
      >
        <span>{triggerLabel}</span>
        <span className="modern-dropdown__chevron" aria-hidden>
          ▼
        </span>
      </button>

      <div
        className={`modern-dropdown__menu modern-dropdown__menu--${align} ${isOpen ? 'is-open' : ''}`}
        role="menu"
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  )
}
