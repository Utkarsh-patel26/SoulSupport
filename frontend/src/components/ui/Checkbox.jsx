"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Checkbox = forwardRef(({ className, label, description, error, ...props }, ref) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border-2 border-border bg-surface text-primary shadow-sm",
            "transition-all duration-200 outline-none cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
            "checked:bg-primary checked:border-primary",
            "disabled:cursor-not-allowed disabled:bg-surface-alt disabled:border-border/50",
            error && "border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={props.id}
              className={cn(
                "text-sm font-semibold text-charcoal cursor-pointer",
                props.disabled && "cursor-not-allowed text-text-muted"
              )}
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-sm text-text-muted mt-0.5" id={`${props.id}-description`}>
              {description}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 font-medium mt-1" aria-live="polite">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
