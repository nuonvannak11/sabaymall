'use client'

import * as React from 'react';
import clsx from 'clsx';

const formBaseClass = "text-sm font-medium text-gray-700";

export function HeaderPanel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("w-full h-[3em]", className)} {...props}>
            {children}
        </div>
    )
}

export function BodyPanel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("w-full h-[16em] lg:h-[30em]", className)} {...props}>
            {children}
        </div>
    )
}

export function FooterPanel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("w-full h-[3em]", className)} {...props}>
            {children}
        </div>
    )
}

export function FormGroup({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("w-full lg:my-[2em] sm:my-[1em]", className)} {...props}>
            {children}
        </div>
    )
}

export function FormLabel({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={clsx(formBaseClass, className)} {...props}>
            {children}
        </label>
    )
}

export function FormInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className={clsx(formBaseClass, className)} {...props} />
    )
}

export function FormButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={clsx(formBaseClass, "cursor-pointer", className)} {...props}>
            {children}
        </button>
    )
}

export function FormSelect({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select className={clsx(formBaseClass, className)} {...props}>
            {children}
        </select>
    )
}

export function FormOption({ children, className, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
    return (
        <option className={clsx(formBaseClass, className)} {...props}>
            {children}
        </option>
    )
}

export function FormTextarea({ children, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea className={clsx(formBaseClass, className)} {...props}>
            {children}
        </textarea>
    )
}

export function FormCheckbox({ children, className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input type="checkbox" className={clsx(formBaseClass, className)} {...props}>
            {children}
        </input>
    )
}

export function FormRadio({ children, className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input type="radio" className={clsx(formBaseClass, className)} {...props}>
            {children}
        </input>
    )
}

export function FormSwitch({ children, className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input type="checkbox" className={clsx(formBaseClass, className)} {...props}>
            {children}
        </input>
    )
}

