import { t } from "ttag";

import type { DataApp, SearchResponse } from "metabase-types/api";

import {
  ENABLED_SEARCH_MODELS,
  type EnabledSearchModel,
} from "../../constants";

import type { SearchModelItem } from "./types";

export function getSearchModelItems(
  data: SearchResponse,
  dataApps: DataApp[],
): SearchModelItem[] {
  const allLabels: Record<EnabledSearchModel, string> = {
    table: t`Tables`,
    transform: t`Transforms`,
    card: t`Questions`,
    dataset: t`Models`,
    metric: t`Metrics`,
    dashboard: t`Dashboards`,
    document: t`Documents`,
    segment: t`Segments`,
  };

  const allItems = ENABLED_SEARCH_MODELS.map((model) => ({
    value: model,
    label: allLabels[model],
  }));

  const availableModels = data.available_models ?? [];
  const items = allItems.filter((item) => availableModels.includes(item.value));

  return dataApps.length > 0
    ? [...items, { value: "data-app", label: t`Data apps` }]
    : items;
}
