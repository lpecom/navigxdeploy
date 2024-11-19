import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-[2rem] font-semibold tracking-tight text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="text-base text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};