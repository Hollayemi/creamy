"use client"

import { useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
    value: string
    label: string
}

export interface MultiSelectProps {
    /** Array of options to display */
    options: SelectOption[]
    /** Currently selected values */
    value: string[]
    /** Callback when selection changes */
    onChange?: (value: string[]) => void
    customOnchange?: (value: any) => any;
    /** Placeholder text when no options are selected */
    placeholder?: string

    fixedPlaceholder?: string;
    /** Custom class name for the trigger button */
    triggerClassName?: string
    /** Custom class name for the dropdown content */
    contentClassName?: string
    /** Custom class name for individual option items */
    itemClassName?: string
    /** Whether the select is disabled */
    disabled?: boolean
    /** Maximum height of dropdown content */
    maxHeight?: number
    /** Whether to show selected count in trigger */
    showSelectedCount?: boolean
}

export function MultiSelect({
    options,
    value,
    onChange,
    customOnchange,
    placeholder = "Select options",
    fixedPlaceholder,
    triggerClassName,
    contentClassName,
    itemClassName,
    disabled = false,
    maxHeight = 250,
    showSelectedCount = false,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOption = (optionValue: string) => {
        if (customOnchange) {
            customOnchange(optionValue)
        } else {
            if (value.includes(optionValue)) {
                onChange?.(value.filter((v) => v !== optionValue))
            } else {
                onChange?.([...value, optionValue])
            }
        }
    }

    const getDisplayText = () => {
        if (value.length === 0) {
            return placeholder
        }

        if (showSelectedCount) {
            return `${value.length} selected`
        }

        // Show selected labels joined by comma
        const selectedLabels = options
            .filter(opt => value.includes(opt.value))
            .map(opt => opt.label)

        return fixedPlaceholder ? fixedPlaceholder : selectedLabels.join(", ")
    }

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger
                disabled={disabled}
                className={cn(
                    "border-input flex w-full min-w-[200px] items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=open]:border-ring",
                    triggerClassName
                )}
            >
                <span className={cn(
                    "truncate",
                    value.length === 0 && "text-muted-foreground"
                )}>
                    {getDisplayText()}
                </span>

                <ChevronDownIcon
                    className={cn(
                        "size-4 opacity-50 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    style={{ maxHeight: `${maxHeight}px` }}
                    className={cn(
                        "bg-popover text-popover-foreground z-50 min-w-[200px] overflow-auto rounded-md border p-1 shadow-md",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                        contentClassName
                    )}
                    align="start"
                    sideOffset={4}
                >
                    {options.map((option) => (
                        <DropdownMenu.CheckboxItem
                            key={option.value}
                            checked={value.includes(option.value)}
                            onCheckedChange={() => toggleOption(option.value)}
                            className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                                "focus:bg-accent focus:text-accent-foreground",
                                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                itemClassName
                            )}
                        >
                            <DropdownMenu.ItemIndicator className="flex items-center justify-center">
                                <CheckIcon className="size-4" />
                            </DropdownMenu.ItemIndicator>
                            {option.label}
                        </DropdownMenu.CheckboxItem>
                    ))}

                    {options.length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                            No options available
                        </div>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}