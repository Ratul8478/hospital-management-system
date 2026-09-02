"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  INDIAN_STATES_AND_DISTRICTS,
  getAllStates,
  getDistrictsByState,
} from '@/lib/location-data';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';

interface StateDistrictSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  disabled?: boolean;
  required?: boolean;
  stateLabel?: string;
  districtLabel?: string;
  themeColor?: 'purple' | 'emerald' | 'blue' | 'slate';
  showCountry?: boolean;
  countryValue?: string;
  onCountryChange?: (country: string) => void;
  className?: string;
}

// In-memory module cache to eliminate duplicate API requests
const locationCache: {
  states: { code: string; name: string }[] | null;
  districtsByState: Record<string, string[]>;
} = {
  states: null,
  districtsByState: {},
};

export default function StateDistrictSelector({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  disabled = false,
  required = true,
  stateLabel = 'State *',
  districtLabel = 'District *',
  themeColor = 'purple',
  showCountry = false,
  countryValue = 'India',
  onCountryChange,
  className = '',
}: StateDistrictSelectorProps) {
  const [statesList, setStatesList] = useState<{ code: string; name: string }[]>(() => {
    return locationCache.states || getAllStates();
  });
  const [availableDistricts, setAvailableDistricts] = useState<string[]>(() => {
    if (!selectedState) return [];
    return locationCache.districtsByState[selectedState] || getDistrictsByState(selectedState);
  });

  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme styling tokens
  const themeClasses = {
    purple: {
      border: 'border-purple-200 focus:border-purple-500',
      label: 'text-purple-950',
      select: 'bg-white text-purple-950',
      badge: 'bg-purple-50 text-purple-700',
    },
    emerald: {
      border: 'border-emerald-200 focus:border-emerald-500',
      label: 'text-emerald-950',
      select: 'bg-white text-emerald-950',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    blue: {
      border: 'border-blue-200 focus:border-blue-500',
      label: 'text-blue-950',
      select: 'bg-white text-blue-950',
      badge: 'bg-blue-50 text-blue-700',
    },
    slate: {
      border: 'border-slate-300 focus:border-slate-600',
      label: 'text-slate-900',
      select: 'bg-white text-slate-900',
      badge: 'bg-slate-100 text-slate-700',
    },
  }[themeColor];

  // Fetch / verify states from API with cached fallback
  useEffect(() => {
    if (locationCache.states && locationCache.states.length > 0) {
      setStatesList(locationCache.states);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchStates = async () => {
      try {
        setIsLoadingStates(true);
        const res = await fetch('/api/v1/locations?type=states', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.states)) {
          if (isMounted) {
            locationCache.states = data.data.states;
            setStatesList(data.data.states);
            setError(null);
          }
        } else {
          throw new Error('Malformed API payload');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        // Graceful fallback to static reference dataset
        const fallback = getAllStates();
        if (isMounted) {
          locationCache.states = fallback;
          setStatesList(fallback);
        }
      } finally {
        if (isMounted) setIsLoadingStates(false);
      }
    };

    fetchStates();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Update districts whenever selectedState changes
  useEffect(() => {
    if (!selectedState) {
      setAvailableDistricts([]);
      if (selectedDistrict) {
        onDistrictChange('');
      }
      return;
    }

    // Check cache first
    const cached = locationCache.districtsByState[selectedState];
    if (cached && cached.length > 0) {
      setAvailableDistricts(cached);
      // If current district doesn't belong to newly selected state, reset it
      if (selectedDistrict && !cached.includes(selectedDistrict)) {
        onDistrictChange('');
      }
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchDistricts = async () => {
      try {
        setIsLoadingDistricts(true);
        const res = await fetch(`/api/v1/locations?type=districts&state=${encodeURIComponent(selectedState)}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data?.districts)) {
          const list: string[] = data.data.districts;
          if (isMounted) {
            locationCache.districtsByState[selectedState] = list;
            setAvailableDistricts(list);
            setError(null);
            if (selectedDistrict && !list.includes(selectedDistrict)) {
              onDistrictChange('');
            }
          }
        } else {
          throw new Error('Malformed payload');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        // Fallback to static reference
        const fallbackDistricts = getDistrictsByState(selectedState);
        if (isMounted) {
          locationCache.districtsByState[selectedState] = fallbackDistricts;
          setAvailableDistricts(fallbackDistricts);
          if (selectedDistrict && !fallbackDistricts.includes(selectedDistrict)) {
            onDistrictChange('');
          }
        }
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedState]);

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    onStateChange(newState);
    // Instant reset of district on state change
    onDistrictChange('');
  };

  const isDistrictDisabled = disabled || !selectedState || isLoadingDistricts;

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className={`grid grid-cols-1 ${showCountry ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
        {/* STATE SELECTOR */}
        <div>
          <label className={`block font-extrabold text-xs mb-1 ${themeClasses.label}`}>
            {stateLabel}
            {isLoadingStates && <Loader2 className="inline ml-1 w-3 h-3 animate-spin text-purple-600" />}
          </label>
          <div className="relative">
            <select
              aria-label={stateLabel}
              required={required}
              disabled={disabled || isLoadingStates}
              value={selectedState}
              onChange={handleStateSelect}
              className={`w-full px-3.5 py-2.5 border text-xs font-bold rounded-xl outline-none transition-all cursor-pointer ${themeClasses.border} ${themeClasses.select} ${
                disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
              }`}
            >
              <option value="">-- Select State / UT --</option>
              {statesList.map((st) => (
                <option key={st.code} value={st.name}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DISTRICT SELECTOR */}
        <div>
          <label className={`block font-extrabold text-xs mb-1 ${themeClasses.label}`}>
            {districtLabel}
            {isLoadingDistricts && <Loader2 className="inline ml-1 w-3 h-3 animate-spin text-purple-600" />}
          </label>
          <div className="relative">
            <select
              aria-label={districtLabel}
              required={required}
              disabled={isDistrictDisabled}
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 border text-xs font-bold rounded-xl outline-none transition-all cursor-pointer ${themeClasses.border} ${themeClasses.select} ${
                isDistrictDisabled ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500' : ''
              }`}
            >
              {!selectedState ? (
                <option value="">Select State first</option>
              ) : availableDistricts.length === 0 ? (
                <option value="">No districts found</option>
              ) : (
                <>
                  <option value="">-- Select District --</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* COUNTRY FIELD (OPTIONAL) */}
        {showCountry && (
          <div>
            <label className={`block font-extrabold text-xs mb-1 ${themeClasses.label}`}>Country *</label>
            <input
              type="text"
              readOnly
              value={countryValue}
              onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 border text-xs font-bold rounded-xl outline-none bg-slate-50 text-slate-700 ${themeClasses.border}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
