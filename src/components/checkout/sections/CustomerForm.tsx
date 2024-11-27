import { AuthForm } from "./auth/AuthForm";

interface CustomerFormProps {
  onSubmit: (data: any) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  return <AuthForm onSuccess={onSubmit} />;
};