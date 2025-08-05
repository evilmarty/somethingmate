export interface AppContainerProps {
  name: string;
  logo: string;
  about?: string;
  links: Record<string, string>;
  children: React.ReactNode;
}

export interface CopyButtonProps {
  value: string;
  size?: number;
  className?: string | null;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: string;
  value: string | number;
  options?: string[] | Record<string, string>;
  className?: string | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export interface FieldProps extends InputProps {
  label?: string;
  align?: "left" | "center" | "right";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fieldName?: string;
  className?: string;
  copyButton?: boolean;
}
