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

    // Predefined product types for mats collection
    const predefinedTypes = [
      { value: "In Door Mats", label: "In Door Mats" },
      { value: "Out Door Mats", label: "Out Door Mats" },
      { value: "Aasan Mats", label: "Aasan Mats" },
      { value: "Animal Rugs", label: "Animal Rugs" },
      { value: "Cotton Yoga Mats", label: "Cotton Yoga Mats" },
      { value: "Bath Mats", label: "Bath Mats" },
      { value: "Bedside Runners", label: "Bedside Runners" },
      { value: "Area Rugs", label: "Area Rugs" },
      { value: "Mats Collection", label: "Mats Collection" },
    ];

    // Predefined sizes
    const predefinedSizes = [
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
      { value: "Extra Large", label: "Extra Large" },
      { value: "30×45 cm", label: "30×45 cm" },
      { value: "35×50 cm", label: "35×50 cm" },
      { value: "40×58 cm", label: "40×58 cm" },
      { value: "44×70 cm", label: "44×70 cm" },
      { value: "50×79 cm", label: "50×79 cm" },
      { value: "60×90 cm", label: "60×90 cm" },
      { value: "70×100 cm", label: "70×100 cm" },
      { value: "80×120 cm", label: "80×120 cm" },
      { value: "12×18 inc", label: "12×18 inc" },
      { value: "14×20 inc", label: "14×20 inc" },
      { value: "16×23 inc", label: "16×23 inc" },
      { value: "17×27.5 inc", label: "17×27.5 inc" },
      { value: "20×31 inc", label: "20×31 inc" },
      { value: "24×36 inc", label: "24×36 inc" },
      { value: "28×40 inc", label: "28×40 inc" },
      { value: "32×48 inc", label: "32×48 inc" },
    ];

    // // Predefined colors
    // const predefinedColors = [
    //   { value: "Red", label: "Red" },
    //   { value: "Blue", label: "Blue" },
    //   { value: "Green", label: "Green" },
    //   { value: "Yellow", label: "Yellow" },
    //   { value: "Orange", label: "Orange" },
    //   { value: "Purple", label: "Purple" },
    //   { value: "Pink", label: "Pink" },
    //   { value: "Brown", label: "Brown" },
    //   { value: "Black", label: "Black" },
    //   { value: "White", label: "White" },
    //   { value: "Gray", label: "Gray" },
    //   { value: "Beige", label: "Beige" },
    //   { value: "Cream", label: "Cream" },
    //   { value: "Navy", label: "Navy" },
    //   { value: "Maroon", label: "Maroon" },
    //   { value: "Teal", label: "Teal" },
    //   { value: "Turquoise", label: "Turquoise" },
    //   { value: "Gold", label: "Gold" },
    //   { value: "Silver", label: "Silver" },
    //   { value: "Multi Color", label: "Multi Color" },
    //   { value: "Brown multicolour", label: "Brown Multicolour" },
    //   { value: "Blue, Multi _color pattern", label: "Blue Multi Color Pattern" },
    //   { value: "Brown multi colors pattern", label: "Brown Multi Colors Pattern" },
    // ];

    // Get actual product data for counts
    const actualTypes = toList(countBy(products, "category"));

    // Handle sizes - can be array or single value
    const sizesArray = products.flatMap((product) => {
      const sizes = [];
      // Direct check for sizes array
      if (Array.isArray(product.sizes)) {
        sizes.push(...product.sizes);
      }
      return sizes;
    });

    const sizesCounts = countBy(sizesArray.map(s => ({ size: s })), "size");
    const actualSizes = toList(sizesCounts);

    // Handle colors - extract from actual product data dynamically
    const colorsArray = products.flatMap((product) => {
      const colors = [];
      // Direct check for colors array
      if (Array.isArray(product.colors)) {
        colors.push(...product.colors);
      }
      return colors;
    });

    const colorsCounts = countBy(colorsArray.map(c => ({ color: c })), "color");
    const actualColors = toList(colorsCounts);

    // Combine predefined options with actual data for types
    const types = predefinedTypes.map(type => {
      const actual = actualTypes.find(t => t.value === type.value);
      return { ...type, count: actual?.count || 0 };
    }).filter(type => type.count > 0); // Only show types that have products

    // Use actual sizes and colors from products (don't try to match with predefined)
    const sizes = actualSizes.map(size => ({
      value: size.value,
      label: size.value,
      count: size.count
    }));

    const colors = actualColors.map(color => ({
      value: color.value,
      label: color.value,
      count: color.count
    }));

    return {
      types,
      sizes,
      colors,
      prices: [
        { value: "ALL", label: "All prices" },
        { value: "0-200", label: "₹0 - ₹200" },
        { value: "200-500", label: "₹200 - ₹500" },
        { value: "500-700", label: "₹500 - ₹700" },
        { value: "700-1000", label: "₹700 - ₹1000" },
        { value: "1000-1500", label: "₹1000 - ₹1500" },
        { value: "1500-2000", label: "₹1500 - ₹2000" },
        { value: "2000-2500", label: "₹2000 - ₹2500" },
        { value: "2500P", label: "₹2500+" },
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
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
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

            {/* Sort Control - Desktop Only */}
            <div className="hidden md:block md:ml-auto">
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
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded transition-all text-xs sm:text-sm ${
          isOpen
            ? "text-gray-900 bg-white border border-gray-300 shadow-sm"
            : "text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-white hover:border-gray-200 border border-gray-200"
        }`}
      >
        <span className="font-medium text-xs sm:text-sm">{label}</span>
        <span className="text-gray-400 text-xs">:</span>
        <span className="text-gray-600 text-xs sm:text-sm">{summary}</span>
        {!noChevron && (
          <svg className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className={[
            "absolute z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg",
            "w-[min(90vw,280px)] sm:w-[min(95vw,320px)] md:w-[min(95vw,350px)] max-h-[70vh] sm:max-h-[60vh] overflow-y-auto",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          <div className="p-3 sm:p-4">{children}</div>
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
      <div className="mb-3 text-xs sm:text-sm font-semibold text-gray-900">{title}</div>
      <div className="max-h-[50vh] sm:max-h-[40vh] overflow-y-auto overflow-x-hidden pr-1 custom-scroll">
        <ul className="space-y-1">
          {options.map(({ value, label, count }) => (
            <li key={value}>
              <label className="flex items-center gap-2 sm:gap-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 flex-shrink-0"
                  checked={selected.includes(value)}
                  onChange={() => onToggle(value)}
                />
                <span className="flex-1 text-xs sm:text-sm text-gray-900 break-words">{label || value}</span>
                {count !== undefined && (
                  <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{count}</span>
                )}
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
      <div className="mb-3 text-xs sm:text-sm font-semibold text-gray-900">{title}</div>
      <div className="max-h-[50vh] sm:max-h-[40vh] overflow-y-auto overflow-x-hidden pr-1 custom-scroll">
        <ul className="space-y-1">
          {options.map((opt) => (
            <li key={opt.value}>
              <label className="flex items-center gap-2 sm:gap-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 flex-shrink-0"
                />
                <span className="flex-1 text-xs sm:text-sm text-gray-900 break-words">{opt.label ?? opt.value}</span>
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
                className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className="text-xs sm:text-sm break-words">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
