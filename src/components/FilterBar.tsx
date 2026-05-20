import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styled, { css } from "styled-components";
import { useLanguage } from "../context/LanguageContext";

const Bar = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: flex-end;
    padding: 1rem 1.25rem;
    background: ${({ theme }) => theme.surface};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    margin-bottom: 1.5rem;
    transition:
        background-color var(--theme-transition-duration, 0.8s) ease,
        border-color var(--theme-transition-duration, 0.8s) ease;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1 1 160px;

    @media (max-width: 768px) {
        width: 100%;
        flex: none;
    }
`;

const Label = styled.label`
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.textMuted};
`;

const fieldStyles = css`
    padding: 0.55rem 0.9rem;
    border-radius: 10px;
    border: 1.5px solid
        ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(255, 255, 255, 0.1)"
                : "#cbd5e0"};
    background: ${({ theme }) =>
        theme.background === "#0d0d14" ? "#1c1c2e" : "#ffffff"};
    color: ${({ theme }) => theme.text};
    font-size: 0.88rem;
    width: 100%;
    min-height: 44px;
    transition:
        background-color var(--theme-transition-duration, 0.8s) ease,
        border-color 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out,
        color var(--theme-transition-duration, 0.8s) ease;
    outline: none;

    &::placeholder {
        color: ${({ theme }) => theme.textMuted};
        opacity: 0.8;
    }

    &:hover {
        border-color: ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.5)"
                : "#a0aec0"};
        background: ${({ theme }) =>
            theme.background === "#0d0d14" ? "#23233a" : "#fafafa"};
    }

    &:focus {
        outline: none !important;
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) =>
            theme.background === "#0d0d14" ? "#1c1c2e" : "#ffffff"};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryLight};
    }
`;

const Input = styled.input`
    ${fieldStyles}
`;

const SelectTrigger = styled.button<{ $isOpen: boolean }>`
    ${fieldStyles}
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    font-weight: 500;
    cursor: text;
    padding-right: 38px;

    ${({ theme, $isOpen }) =>
        $isOpen
            ? `
                border-color: ${theme.primary};
                box-shadow: 0 0 0 3px ${theme.primaryLight};
            `
            : ""}
`;

const ClearButton = styled.button`
    padding: 0.55rem 1rem;
    border-radius: 10px;
    background: rgba(151, 206, 76, 0.1);
    border: 1.5px solid rgba(151, 206, 76, 0.2);
    color: #97ce4c;
    font-size: 0.85rem;
    font-weight: 600;
    align-self: flex-end;
    transition: all 0.2s ease;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: #e05a47;
        border-color: #e05a47;
        color: #fff;
    }

    @media (max-width: 768px) {
        width: 100%;
        align-self: stretch;
        margin-top: 0.5rem;
    }
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`;

const IconContainer = styled.div`
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const SelectValue = styled.span<{ $isPlaceholder?: boolean }>`
    color: ${({ theme, $isPlaceholder }) =>
        $isPlaceholder ? theme.textMuted : theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const SpinnerIcon = styled.div`
    border: 2px solid rgba(151, 206, 76, 0.2);
    border-top: 2px solid #97ce4c;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    animation: spin 0.7s linear infinite;
`;

const SuggestionsPanel = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 30;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid
        ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.3)"
                : "rgba(68, 140, 63, 0.18)"};
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "linear-gradient(180deg, rgba(19, 22, 34, 0.98) 0%, rgba(25, 28, 42, 0.98) 100%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 249, 252, 0.98) 100%)"};
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
`;

const SuggestionsHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 0.9rem 0.55rem;
    border-bottom: 1px solid
        ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(255,255,255,0.06)"
                : "rgba(26,32,44,0.06)"};
    color: ${({ theme }) => theme.primary};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
`;

const SuggestionsHeaderLabel = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
`;

const PortalDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, #d7ff77 0%, #97ce4c 55%, #448c3f 100%);
    box-shadow: 0 0 10px rgba(151, 206, 76, 0.65);
`;

const SuggestionsCount = styled.span`
    color: ${({ theme }) => theme.textMuted};
    font-weight: 600;
`;

const SuggestionsList = styled.ul`
    max-height: 288px;
    overflow-y: auto;
    padding: 0.35rem;
`;

const SuggestionItem = styled.li<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    min-height: 44px;
    padding: 0.7rem 0.8rem;
    border-radius: 12px;
    color: ${({ theme, $active }) =>
        $active ? theme.text : theme.textSecondary};
    background: ${({ theme, $active }) => {
        if ($active) {
            return theme.background === "#0d0d14"
                ? "linear-gradient(90deg, rgba(151, 206, 76, 0.18), rgba(8, 186, 227, 0.08))"
                : "linear-gradient(90deg, rgba(151, 206, 76, 0.14), rgba(8, 186, 227, 0.06))";
        }

        return "transparent";
    }};
    border: 1px solid
        ${({ theme, $active }) =>
            $active
                ? theme.background === "#0d0d14"
                    ? "rgba(151, 206, 76, 0.25)"
                    : "rgba(68, 140, 63, 0.15)"
                : "transparent"};
    transition:
        background 0.18s ease,
        border-color 0.18s ease,
        transform 0.18s ease,
        color 0.18s ease;
    cursor: pointer;

    &:hover {
        transform: translateX(2px);
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "linear-gradient(90deg, rgba(151, 206, 76, 0.14), rgba(8, 186, 227, 0.08))"
                : "linear-gradient(90deg, rgba(151, 206, 76, 0.12), rgba(8, 186, 227, 0.05))"};
        border-color: ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.2)"
                : "rgba(68, 140, 63, 0.12)"};
    }
`;

const SuggestionBullet = styled.span<{ $active: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ $active }) =>
        $active
            ? "radial-gradient(circle, #d7ff77 0%, #97ce4c 55%, #448c3f 100%)"
            : "radial-gradient(circle, rgba(8, 186, 227, 0.9) 0%, rgba(8, 186, 227, 0.45) 60%, rgba(8, 186, 227, 0.15) 100%)"};
    box-shadow: ${({ $active }) =>
        $active
            ? "0 0 14px rgba(151, 206, 76, 0.5)"
            : "0 0 10px rgba(8, 186, 227, 0.32)"};
`;

const SuggestionText = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.92rem;
    font-weight: 600;
`;

const EmptySuggestion = styled.div`
    padding: 0.95rem 1rem 1rem;
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.85rem;
`;

const SearchIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(151, 206, 76, 0.8)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const PortalIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(8, 186, 227, 0.8)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 3C7.5 3 4 7 4 12s3.5 9 8 9 8-4 8-9-3.5-9-8-9Z"></path>
        <path d="M8.2 8.7c1.7-1.5 5.3-1.8 7.4.4"></path>
        <path d="M7.6 12.1c2.1-1.9 6.6-2 8.8.7"></path>
        <path d="M8.5 15.4c1.8-1 4.5-1.1 6.2.5"></path>
    </svg>
);

interface Field {
    key: string;
    label: string;
    type: "text" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
    suggestions?: string[];
    autoComplete?: string;
}

interface FilterBarProps {
    fields: Field[];
    values: Record<string, string>;
    onChange: (values: Record<string, string>) => void;
    debounceMs?: number;
}

export function FilterBar({
    fields,
    values,
    onChange,
    debounceMs = 400,
}: FilterBarProps) {
    const { t, lang } = useLanguage();
    const [local, setLocal] = useState(values);
    const [debouncingFieldKey, setDebouncingFieldKey] = useState<string | null>(
        null,
    );
    const [openFieldKey, setOpenFieldKey] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        setLocal(values);
    }, [values]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideOpenField = openFieldKey
                ? wrapperRefs.current[openFieldKey]?.contains(target)
                : false;

            if (!isInsideOpenField) {
                setOpenFieldKey(null);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () =>
            document.removeEventListener("mousedown", handlePointerDown);
    }, [openFieldKey]);

    const getFilteredSuggestions = useCallback(
        (field: Field) => {
            if (field.type !== "text" || !field.suggestions?.length) return [];

            const query = (local[field.key] ?? "").trim().toLowerCase();
            const uniqueSuggestions = Array.from(new Set(field.suggestions));

            if (!query) return uniqueSuggestions.slice(0, 8);

            return uniqueSuggestions
                .filter((suggestion) => suggestion.toLowerCase() !== query)
                .filter((suggestion) =>
                    suggestion.toLowerCase().includes(query),
                )
                .slice(0, 8);
        },
        [local],
    );

    const filteredSuggestionsMap = useMemo(
        () =>
            Object.fromEntries(
                fields.map((field) => [
                    field.key,
                    getFilteredSuggestions(field),
                ]),
            ),
        [fields, getFilteredSuggestions],
    ) as Record<string, string[]>;

    const getSelectOptions = useCallback(
        (field: Field) => [
            { value: "", label: t("filter_all") },
            ...(field.options ?? []),
        ],
        [t],
    );

    const commitTextValue = useCallback(
        (key: string, value: string, immediate = false) => {
            const next = { ...local, [key]: value };
            setLocal(next);

            if (timerRef.current) clearTimeout(timerRef.current);

            if (immediate) {
                setDebouncingFieldKey(null);
                onChange(next);
                return;
            }

            setDebouncingFieldKey(key);
            timerRef.current = setTimeout(() => {
                setDebouncingFieldKey(null);
                onChange(next);
            }, debounceMs);
        },
        [debounceMs, local, onChange],
    );

    const handleChange = useCallback(
        (key: string, value: string, isSelect: boolean) => {
            if (isSelect) {
                const next = { ...local, [key]: value };
                setLocal(next);
                onChange(next);
                return;
            }

            commitTextValue(key, value, false);
        },
        [commitTextValue, local, onChange],
    );

    const handleSuggestionSelect = useCallback(
        (key: string, value: string) => {
            commitTextValue(key, value, true);
            setOpenFieldKey(null);
            setHighlightedIndex(-1);
        },
        [commitTextValue],
    );

    const handleSelectOptionSelect = useCallback(
        (key: string, value: string) => {
            const next = { ...local, [key]: value };
            setLocal(next);
            setOpenFieldKey(null);
            setHighlightedIndex(-1);
            onChange(next);
        },
        [local, onChange],
    );

    const handleClear = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const reset: Record<string, string> = {};
        fields.forEach((f) => (reset[f.key] = ""));
        setLocal(reset);
        setDebouncingFieldKey(null);
        setOpenFieldKey(null);
        setHighlightedIndex(-1);
        onChange(reset);
    };

    const hasValues = Object.values(local).some((v) => v !== "");

    return (
        <Bar>
            {fields.map((field) => {
                const suggestions = filteredSuggestionsMap[field.key] ?? [];
                const isOpen = openFieldKey === field.key;
                const showSuggestions =
                    field.type === "text" &&
                    isOpen &&
                    !!field.suggestions?.length;
                const showEmptyState =
                    showSuggestions &&
                    (local[field.key] ?? "").trim().length > 0 &&
                    suggestions.length === 0;

                return (
                    <FieldGroup key={field.key}>
                        <Label htmlFor={`filter-${field.key}`}>
                            {field.label}
                        </Label>
                        {field.type === "select" ? (
                            <InputWrapper
                                ref={(node) => {
                                    wrapperRefs.current[field.key] = node;
                                }}
                            >
                                {(() => {
                                    const selectOptions =
                                        getSelectOptions(field);
                                    const selectedValue =
                                        local[field.key] ?? "";
                                    const selectedOption =
                                        selectOptions.find(
                                            (option) =>
                                                option.value === selectedValue,
                                        ) ?? selectOptions[0];
                                    const isSelectOpen =
                                        openFieldKey === field.key;

                                    return (
                                        <>
                                            <SelectTrigger
                                                id={`filter-${field.key}`}
                                                type="button"
                                                $isOpen={isSelectOpen}
                                                aria-haspopup="listbox"
                                                aria-expanded={isSelectOpen}
                                                aria-controls={`filter-${field.key}-options`}
                                                onClick={() => {
                                                    if (isSelectOpen) {
                                                        setOpenFieldKey(null);
                                                        setHighlightedIndex(-1);
                                                        return;
                                                    }

                                                    setOpenFieldKey(field.key);
                                                    setHighlightedIndex(
                                                        Math.max(
                                                            0,
                                                            selectOptions.findIndex(
                                                                (option) =>
                                                                    option.value ===
                                                                    selectedValue,
                                                            ),
                                                        ),
                                                    );
                                                }}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "ArrowDown" ||
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        e.preventDefault();

                                                        if (!isSelectOpen) {
                                                            setOpenFieldKey(
                                                                field.key,
                                                            );
                                                            setHighlightedIndex(
                                                                Math.max(
                                                                    0,
                                                                    selectOptions.findIndex(
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            selectedValue,
                                                                    ),
                                                                ),
                                                            );
                                                            return;
                                                        }

                                                        setHighlightedIndex(
                                                            (prev) =>
                                                                prev <
                                                                selectOptions.length -
                                                                    1
                                                                    ? prev + 1
                                                                    : 0,
                                                        );
                                                    }

                                                    if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        if (!isSelectOpen) {
                                                            setOpenFieldKey(
                                                                field.key,
                                                            );
                                                            setHighlightedIndex(
                                                                Math.max(
                                                                    0,
                                                                    selectOptions.findIndex(
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            selectedValue,
                                                                    ),
                                                                ),
                                                            );
                                                            return;
                                                        }

                                                        setHighlightedIndex(
                                                            (prev) =>
                                                                prev > 0
                                                                    ? prev - 1
                                                                    : selectOptions.length -
                                                                      1,
                                                        );
                                                    }

                                                    if (
                                                        e.key === "Enter" &&
                                                        isSelectOpen &&
                                                        highlightedIndex >= 0 &&
                                                        selectOptions[
                                                            highlightedIndex
                                                        ]
                                                    ) {
                                                        e.preventDefault();
                                                        handleSelectOptionSelect(
                                                            field.key,
                                                            selectOptions[
                                                                highlightedIndex
                                                            ].value,
                                                        );
                                                    }

                                                    if (e.key === "Escape") {
                                                        setOpenFieldKey(null);
                                                        setHighlightedIndex(-1);
                                                    }
                                                }}
                                            >
                                                <SelectValue
                                                    $isPlaceholder={
                                                        selectedOption.value ===
                                                        ""
                                                    }
                                                >
                                                    {selectedOption.label}
                                                </SelectValue>
                                            </SelectTrigger>

                                            <IconContainer>
                                                <PortalIcon />
                                            </IconContainer>

                                            {isSelectOpen && (
                                                <SuggestionsPanel
                                                    id={`filter-${field.key}-options`}
                                                    role="listbox"
                                                >
                                                    <SuggestionsHeader>
                                                        <SuggestionsHeaderLabel>
                                                            <PortalDot />
                                                            {lang === "pt"
                                                                ? "Filtro Dimensional"
                                                                : "Dimensional Filter"}
                                                        </SuggestionsHeaderLabel>
                                                        <SuggestionsCount>
                                                            {
                                                                selectOptions.length
                                                            }{" "}
                                                            {lang === "pt"
                                                                ? "opções"
                                                                : "options"}
                                                        </SuggestionsCount>
                                                    </SuggestionsHeader>

                                                    <SuggestionsList>
                                                        {selectOptions.map(
                                                            (option, index) => {
                                                                const isActive =
                                                                    highlightedIndex ===
                                                                    index;
                                                                const isSelected =
                                                                    option.value ===
                                                                    selectedValue;

                                                                return (
                                                                    <SuggestionItem
                                                                        key={`${field.key}-${option.value || "all"}`}
                                                                        $active={
                                                                            isActive ||
                                                                            isSelected
                                                                        }
                                                                        role="option"
                                                                        aria-selected={
                                                                            isSelected
                                                                        }
                                                                        onMouseDown={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleSelectOptionSelect(
                                                                                field.key,
                                                                                option.value,
                                                                            );
                                                                        }}
                                                                        onMouseEnter={() =>
                                                                            setHighlightedIndex(
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SuggestionBullet
                                                                            $active={
                                                                                isActive ||
                                                                                isSelected
                                                                            }
                                                                        />
                                                                        <SuggestionText>
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SuggestionText>
                                                                    </SuggestionItem>
                                                                );
                                                            },
                                                        )}
                                                    </SuggestionsList>
                                                </SuggestionsPanel>
                                            )}
                                        </>
                                    );
                                })()}
                            </InputWrapper>
                        ) : (
                            <InputWrapper
                                ref={(node) => {
                                    wrapperRefs.current[field.key] = node;
                                }}
                            >
                                <Input
                                    id={`filter-${field.key}`}
                                    type="text"
                                    autoComplete={field.autoComplete ?? "off"}
                                    placeholder={
                                        field.placeholder ??
                                        `${t("filter_placeholder_name")}...`
                                    }
                                    value={local[field.key] ?? ""}
                                    onFocus={() => {
                                        if (field.suggestions?.length) {
                                            setOpenFieldKey(field.key);
                                            setHighlightedIndex(-1);
                                        }
                                    }}
                                    onChange={(e) => {
                                        handleChange(
                                            field.key,
                                            e.target.value,
                                            false,
                                        );
                                        if (field.suggestions?.length) {
                                            setOpenFieldKey(field.key);
                                            setHighlightedIndex(-1);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (!field.suggestions?.length) return;

                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            setOpenFieldKey(field.key);
                                            setHighlightedIndex((prev) => {
                                                if (!suggestions.length)
                                                    return -1;
                                                return prev <
                                                    suggestions.length - 1
                                                    ? prev + 1
                                                    : 0;
                                            });
                                        }

                                        if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            setOpenFieldKey(field.key);
                                            setHighlightedIndex((prev) => {
                                                if (!suggestions.length)
                                                    return -1;
                                                return prev > 0
                                                    ? prev - 1
                                                    : suggestions.length - 1;
                                            });
                                        }

                                        if (
                                            e.key === "Enter" &&
                                            isOpen &&
                                            highlightedIndex >= 0 &&
                                            suggestions[highlightedIndex]
                                        ) {
                                            e.preventDefault();
                                            handleSuggestionSelect(
                                                field.key,
                                                suggestions[highlightedIndex],
                                            );
                                        }

                                        if (e.key === "Escape") {
                                            setOpenFieldKey(null);
                                            setHighlightedIndex(-1);
                                        }
                                    }}
                                    aria-expanded={showSuggestions}
                                    aria-controls={
                                        field.suggestions?.length
                                            ? `filter-${field.key}-suggestions`
                                            : undefined
                                    }
                                    aria-autocomplete={
                                        field.suggestions?.length
                                            ? "list"
                                            : undefined
                                    }
                                    style={{ paddingRight: "38px" }}
                                />

                                {showSuggestions && (
                                    <SuggestionsPanel
                                        id={`filter-${field.key}-suggestions`}
                                        role="listbox"
                                    >
                                        <SuggestionsHeader>
                                            <SuggestionsHeaderLabel>
                                                <PortalDot />
                                                {lang === "pt"
                                                    ? "Sinais do Multiverso"
                                                    : "Multiverse Signals"}
                                            </SuggestionsHeaderLabel>
                                            <SuggestionsCount>
                                                {suggestions.length}{" "}
                                                {lang === "pt"
                                                    ? "opções"
                                                    : "options"}
                                            </SuggestionsCount>
                                        </SuggestionsHeader>

                                        {suggestions.length > 0 ? (
                                            <SuggestionsList>
                                                {suggestions.map(
                                                    (suggestion, index) => {
                                                        const isActive =
                                                            highlightedIndex ===
                                                            index;

                                                        return (
                                                            <SuggestionItem
                                                                key={suggestion}
                                                                $active={
                                                                    isActive
                                                                }
                                                                role="option"
                                                                aria-selected={
                                                                    isActive
                                                                }
                                                                onMouseDown={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    handleSuggestionSelect(
                                                                        field.key,
                                                                        suggestion,
                                                                    );
                                                                }}
                                                                onMouseEnter={() =>
                                                                    setHighlightedIndex(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <SuggestionBullet
                                                                    $active={
                                                                        isActive
                                                                    }
                                                                />
                                                                <SuggestionText>
                                                                    {suggestion}
                                                                </SuggestionText>
                                                            </SuggestionItem>
                                                        );
                                                    },
                                                )}
                                            </SuggestionsList>
                                        ) : showEmptyState ? (
                                            <EmptySuggestion>
                                                {lang === "pt"
                                                    ? "Nenhum portal encontrado para esse termo."
                                                    : "No portal hit found for that term."}
                                            </EmptySuggestion>
                                        ) : null}
                                    </SuggestionsPanel>
                                )}

                                <IconContainer>
                                    {debouncingFieldKey === field.key ? (
                                        <SpinnerIcon />
                                    ) : field.suggestions?.length ? (
                                        <PortalIcon />
                                    ) : local[field.key] ? (
                                        <SearchIcon />
                                    ) : null}
                                </IconContainer>
                            </InputWrapper>
                        )}
                    </FieldGroup>
                );
            })}
            {hasValues && (
                <ClearButton onClick={handleClear} type="button">
                    {lang === "pt" ? "✕ Limpar" : "✕ Clear"}
                </ClearButton>
            )}
        </Bar>
    );
}
