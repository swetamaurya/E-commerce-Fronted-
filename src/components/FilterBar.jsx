import React, { useEffect, useMemo, useRef, useState } from "react";

export default function FilterBar({ filters, setFilters, products = [], total = 0 }) {
  const facets = useMemo(() => {
    const countBy = (arr, key) =>
      arr.reduce((m, it) => {
        const k = (it[key] ?? "").toString().trim();
        if (!k) return m;
        m[k] = (m[k] || 0) + 1;
        return m;
      }, {});
    const toList = (obj) =>
      Object.entries(obj)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, count }));

    return {
      types: toList(countBy(products, "type")),
      sizes: toList(countBy(products, "size")),
      colors: toList(countBy(products, "color")),
      prices: [
        { value: "ALL", label: "All prices" },
        { value: "0-200", label: "0 - 200" },
        { value: "200-500", label: "200 - 500" },
        { value: "500-700", label: "500 - 700" },
        { value: "700-1000", label: "700 - 1000" },
        { value: "1000-1500", label: "1000 - 1500" },
        { value: "1500-2000", label: "1500 - 2000" },
        { value: "2000-2500", label: "2000 - 2500" },
        { value: "2500P", label: "2500+" },
      ],
      sorts: [
        { value: "pop", label: "Popularity" },
        { value: "phl", label: "Price High to Low" },
        { value: "plh", label: "Price Low to High" },
        { value: "new", label: "Newest" },
      ],
    };
  }, [products]);

  const [open, setOpen] = useState(null); // 'type' | 'size' | 'color' | 'price' | 'sort' | null
  const wrapRef = useRef(null);

  // close on outside / Esc
  useEffect(() => {
    const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(null); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // helpers
  const toggleSel = (key, value) => {
    setFilters((prev) => {
      const curr = new Set(prev[key] ?? []);
      curr.has(value) ? curr.delete(value) : curr.add(value);
      return { ...prev, [key]: Array.from(curr) };
    });
  };
  const setSingle = (key, v) => { setFilters((p) => ({ ...p, [key]: v })); setOpen(null); };

  const summary = (arr) => !arr || arr.length === 0 ? "All" : arr.length === 1 ? arr[0] : `${arr[0]} +${arr.length - 1}`;
  const priceSummary = (list, v) => list.find((x) => x.value === v)?.label ?? "All prices";

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      type: [],
      size: [],
      color: [],
      price: "ALL",
      sort: "pop",
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.type.length > 0 || filters.size.length > 0 || filters.color.length > 0 || filters.price !== "ALL";

  return (
    <div ref={wrapRef} className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Clean Filter Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Filter Controls */}
            <FilterGroup
              label="Product Type"
              summary={summary(filters.type)}
              isOpen={open === "type"}
              onOpen={() => setOpen(open === "type" ? null : "type")}
            >
              <CheckboxList title="Product Type" options={facets.types} selected={filters.type} onToggle={(v) => toggleSel("type", v)} />
            </FilterGroup>

            <FilterGroup
              label="Size"
              summary={summary(filters.size)}
              isOpen={open === "size"}
              onOpen={() => setOpen(open === "size" ? null : "size")}
            >
              <CheckboxList title="Size" options={facets.sizes} selected={filters.size} onToggle={(v) => toggleSel("size", v)} />
            </FilterGroup>

            <FilterGroup
              label="Colour/Variant"
              summary={summary(filters.color)}
              isOpen={open === "color"}
              onOpen={() => setOpen(open === "color" ? null : "color")}
            >
              <CheckboxList title="Colour/Variant" options={facets.colors} selected={filters.color} onToggle={(v) => toggleSel("color", v)} />
            </FilterGroup>

            <FilterGroup
              label="Price Range"
              summary={priceSummary(facets.prices, filters.price)}
              isOpen={open === "price"}
              onOpen={() => setOpen(open === "price" ? null : "price")}
            >
              <RadioList title="Price Range" options={facets.prices} value={filters.price} onChange={(v) => setSingle("price", v)} />
            </FilterGroup>

            {/* Sort Control */}
            <div className="ml-auto">
              <FilterGroup
                label="Sort by"
                summary={facets.sorts.find((s) => s.value === filters.sort)?.label ?? "Popularity"}
                isOpen={open === "sort"}
                onOpen={() => setOpen(open === "sort" ? null : "sort")}
                noChevron
                align="right"
              >
                <MenuList options={facets.sorts} value={filters.sort} onChange={(v) => setSingle("sort", v)} />
              </FilterGroup>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{total}</span> products
            </p>
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="px-4 sm:px-6 lg:px-8 py-3 bg-white border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.type.map(type => (
                <FilterChip key={type} label={type} onRemove={() => toggleSel("type", type)} />
              ))}
              {filters.size.map(size => (
                <FilterChip key={size} label={size} onRemove={() => toggleSel("size", size)} />
              ))}
              {filters.color.map(color => (
                <FilterChip key={color} label={color} onRemove={() => toggleSel("color", color)} />
              ))}
              {filters.price !== "ALL" && (
                <FilterChip 
                  key={filters.price} 
                  label={priceSummary(facets.prices, filters.price)} 
                  onRemove={() => setSingle("price", "ALL")} 
                />
              )}
              <button
                onClick={clearAllFilters}
                className="ml-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------- Filter Group ------- */
function FilterGroup({ label, summary, isOpen, onOpen, noChevron = false, align = "left", children }) {
  return (
    <div className="relative">
      <button
        onClick={onOpen}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm ${
          isOpen 
            ? "text-gray-900 bg-white border border-gray-300 shadow-sm" 
            : "text-gray-700 bg-gray-100 hover:text-gray-900 hover:bg-white hover:border-gray-200 border border-transparent"
        }`}
      >
        <span className="font-medium text-sm">{label}</span>
        <span className="text-gray-500 text-sm">:</span>
        <span className="text-gray-600 text-sm">{summary}</span>
        {!noChevron && (
          <svg className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className={[
            "absolute z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg",
            "w-[min(95vw,350px)]",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          <div className="p-4">{children}</div>
        </div>
      )}
    </div>
  );
}

/* ------- Filter Chip ------- */
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </span>
  );
}

/* ------- Checkbox List ------- */
function CheckboxList({ title, options, selected, onToggle }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-gray-900">{title}</div>
      <div className="max-h-[40vh] overflow-auto pr-1 custom-scroll">
        <ul className="space-y-1">
          {options.map(({ value, count }) => (
            <li key={value}>
              <label className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  checked={selected.includes(value)}
                  onChange={() => onToggle(value)}
                />
                <span className="flex-1 text-sm text-gray-900">{value}</span>
                <span className="text-sm text-gray-500">{count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------- Radio List ------- */
function RadioList({ title, options, value, onChange }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-gray-900">{title}</div>
      <div className="max-h-[40vh] overflow-auto pr-1 custom-scroll">
        <ul className="space-y-1">
          {options.map((opt) => (
            <li key={opt.value}>
              <label className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                />
                <span className="flex-1 text-sm text-gray-900">{opt.label ?? opt.value}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------- Menu List ------- */
function MenuList({ options, value, onChange }) {
  return (
    <div className="py-1">
      <ul className="min-w-[200px] space-y-1">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <li key={opt.value}>
              <button
                onClick={() => onChange(opt.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active 
                    ? "bg-gray-100 text-gray-900" 
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
