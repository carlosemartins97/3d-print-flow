import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 py-4 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-bold text-slate-900 ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end ${className}`}>{children}</div>;
}
