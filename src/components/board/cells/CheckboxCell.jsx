import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckboxCell({ value, onUpdate }) {
  const isChecked = !!value; // Ensure boolean

  const handleChange = (checked) => {
    onUpdate(checked);
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label="Checkbox"
      />
    </div>
  );
}