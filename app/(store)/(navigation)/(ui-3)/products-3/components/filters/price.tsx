"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useQueryParams } from "@/hook/use-query-params";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";
import { FilterWrapper } from "./filter-wrapper";

interface PriceFilterProps {
  priceFromServer?: number;
  priceToServer?: number;
}

export const PriceFilter = ({ priceFromServer, priceToServer }: PriceFilterProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { selectedCurrency } = useSettingsStore();
  const [priceFrom, setPriceFrom] = useState(
    searchParams.has("priceFrom") ? Number(searchParams.get("priceFrom")) : 0
  );
  const [priceTo, setPriceTo] = useState(
    searchParams.has("priceTo") ? Number(searchParams.get("priceTo")) : 0
  );
  const { setQueryParams } = useQueryParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (!searchParams.has("priceFrom") && !searchParams.has("priceTo")) {
      setPriceFrom(priceFromServer || 0);
      setPriceTo(priceToServer || 0);
    }
  }, [priceFromServer, priceToServer]);

  const renderSubTitle = (from: number | null, to: number | null) => {
    const position = selectedCurrency?.position;
    const symbol = selectedCurrency?.symbol;
    if (position === "before") {
      return `${symbol || "$"} ${from || 0} to ${symbol || "$"} ${to || 0} selected`;
    }
    return `${from || 0} ${symbol || "$"} to ${to || 0} ${symbol || "$"} selected`;
  };

  return (
    <FilterWrapper title="price.ranges" subTitle={renderSubTitle(priceFrom, priceTo)}>
      <div className="flex items-center gap-3 w-full">
        <input
          placeholder={`${t("from")} ${priceFrom || 0}`}
          value={priceFrom}
          onChange={(e) => {
            setPriceFrom(e.target.valueAsNumber);
            startTransition(() => {
              setQueryParams(
                { priceFrom: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber },
                false
              );
            });
          }}
          type="number"
          className="flex-1 w-1/2 border border-gray-inputBorder rounded-2xl py-3 px-5"
          min={0}
        />
        <input
          placeholder={`${t("to")} ${priceTo || 0}`}
          value={priceTo}
          onChange={(e) => {
            setPriceTo(e.target.valueAsNumber);
            startTransition(() => {
              setQueryParams(
                { priceTo: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber },
                false
              );
            });
          }}
          type="number"
          className="flex-1 w-1/2 border border-gray-inputBorder rounded-2xl py-3 px-5"
          min={0}
        />
      </div>
    </FilterWrapper>
  );
};
