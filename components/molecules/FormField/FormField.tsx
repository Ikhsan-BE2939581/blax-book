import React from 'react';
import { Label } from '@/components/atoms/Label/Label';
import { Input, InputProps } from '@/components/atoms/Input/Input';

interface FormFieldProps extends InputProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  description,
  id,
  ...inputProps
}) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      <Input
        id={fieldId}
        error={error}
        {...inputProps}
      />
    </div>
  );
};