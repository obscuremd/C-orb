import { View, Text } from 'react-native';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, X, AlertTriangle, Info } from 'lucide-react-native';

const variantIcons = {
  default: Info, // ℹ️
  success: Check, // ✅
  destructive: X, // ❌
  warning: AlertTriangle, // ⚠️
};

interface props {
  variant?: 'success' | 'destructive' | 'default' | 'warning';
  title: string;
  description: string;
}

const CustomAlert = ({ variant = 'default', title, description }: props) => {
  return (
    <Alert icon={variantIcons[variant]} className="max-w-xl" variant={variant}>
      <AlertTitle variant={variant}>{title}</AlertTitle>
      <AlertDescription variant={variant}>{description}</AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
