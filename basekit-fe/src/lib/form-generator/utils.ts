import { createFormHookContexts } from '@tanstack/react-form';
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();