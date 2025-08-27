import { useTheme } from "@react-navigation/native";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

const alertVariants = cva(
  "relative bg-background w-full rounded-lg border border-border p-4 shadow shadow-foreground/10",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive",
        success: "border-[#059669] text-[#059669]",
        warning: "border-[#f59e0b] text-[#f59e0b]", // amber-500
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      destructive: "text-destructive",
      success: "text-[#059669]",
      warning: "text-[#f59e0b]", // amber-500
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariants = {
  default: (colors: any) => colors.text,
  destructive: (colors: any) => colors.notification,
  success: () => "#059669",
  warning: () => "#f59e0b", // amber-500
};

type AlertVariant = "default" | "destructive" | "success" | "warning";

function Alert({
  className,
  variant = "default",
  children,
  icon: Icon,
  iconSize = 16,
  iconClassName,
  ...props
}: ViewProps &
  VariantProps<typeof alertVariants> & {
    ref?: React.RefObject<View>;
    icon: LucideIcon;
    iconSize?: number;
    iconClassName?: string;
    variant?: AlertVariant;
  }) {
  const { colors } = useTheme();

  const safeVariant: AlertVariant = variant ?? "default";
  const iconColor = iconVariants[safeVariant]
    ? iconVariants[safeVariant](colors)
    : colors.text;

  return (
    <View
      role="alert"
      className={alertVariants({ variant: safeVariant, className })}
      {...props}
    >
      <View className="absolute left-3.5 top-4 -translate-y-0.5">
        <Icon size={iconSize} color={iconColor} className={iconClassName} />
      </View>
      {children}
    </View>
  );
}

function AlertTitle({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Text> & {
  variant?: AlertVariant; // ⚡ use AlertVariant here
}) {
  return (
    <Text
      className={cn(
        "pl-7 mb-1 font-medium text-base leading-none tracking-tight",
        textVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Text> & {
  variant?: AlertVariant; // ⚡ use AlertVariant here too
}) {
  return (
    <Text
      className={cn(
        "pl-7 text-sm leading-relaxed",
        textVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
