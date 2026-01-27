"use client"
import * as React from "react"
import { ChevronDown } from "lucide-react" 
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {} });

const Select = ({ value, onValueChange, children }: { value: string, onValueChange: (val: string) => void, children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn("flex h-10 w-full items-center justify-between rounded-md border border-slate-600 bg-[#283039] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white", className)}
            ref={ref}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
});
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, placeholder, ...props }, ref) => {
    const { value } = React.useContext(SelectContext);
    return (
        <span ref={ref} className={cn("block truncate", className)} {...props}>
             {value ? value : placeholder}
        </span>
    )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);
    if (!open) return null;
    
    return (
        <>
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
        <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-600 bg-[#283039] text-white shadow-md animate-in fade-in-80 mt-1", className)} ref={ref} {...props}>
            <div className="p-1">{children}</div>
        </div>
        </>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange, setOpen } = React.useContext(SelectContext);
    const isSelected = value === itemValue;
    
    return (
        <div 
            ref={ref}
            className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-[#3b4754] cursor-pointer", isSelected && "bg-[#3b4754] font-bold", className)}
            onClick={(e) => {
                e.stopPropagation();
                onValueChange(itemValue);
                setOpen(false);
            }}
            {...props}
        >
             <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <span className="h-2 w-2 rounded-full bg-blue-500" />}
             </span>
             {children}
        </div>
    )
})
SelectItem.displayName = "SelectItem"

const SelectGroup = ({ children }: any) => <div>{children}</div>
const SelectLabel = ({ children }: any) => <div>{children}</div>
const SelectSeparator = () => <hr className="my-1 border-slate-600" />

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator } 
