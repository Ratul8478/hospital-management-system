"use client";

import { use } from "react";
import { PersonalHealthRecordCard } from "@/components/PersonalHealthRecordCard";

type DashboardPageProps = {
  searchParams?: Promise<{
    name?: string | string[];
    phone?: string | string[];
  }>;
};

export default function DoctorDashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const name = typeof resolvedSearchParams?.name === "string" ? resolvedSearchParams.name : "";
  const phone = typeof resolvedSearchParams?.phone === "string" ? resolvedSearchParams.phone : "";

  return <PersonalHealthRecordCard role="doctor" registeredName={name} registeredPhone={phone} />;
}

