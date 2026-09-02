"use client";

import React from 'react';
import { useApp } from '@/lib/store';
import { CONCEPTS_LIST } from '@/lib/concepts';
import Concept7 from '@/components/landing-concepts/Concept7';

export default function LandingPage() {
  const { selectedLandingConceptId } = useApp();
  const currentConcept =
    CONCEPTS_LIST.find((c) => c.id === selectedLandingConceptId) ||
    CONCEPTS_LIST.find((c) => c.id === 7);
  const ActiveComponent = currentConcept?.component || Concept7;

  return <ActiveComponent />;
}
