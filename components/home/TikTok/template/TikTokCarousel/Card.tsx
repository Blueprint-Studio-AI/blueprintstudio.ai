import { ReactNode } from "react";
import React from 'react';

interface CardProps {
    children: ReactNode;
}

export default function Card({ children }: CardProps) {
    return (
        <div className="w-full h-full bg-white">
            { children }
        </div>
    );
}