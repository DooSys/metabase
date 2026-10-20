import { useDisclosure } from "@mantine/hooks";
import { t } from "ttag";

import { useSearchQuery } from "metabase/api";
import { useHasTokenFeature } from "metabase/common/hooks";
import {
  ActionIcon,
  Box,
  Center,
  Checkbox,
  FixedSizeIcon,
  Loader,
  Popover,
  Stack,
} from "metabase/ui";
import { useListDataAppsQuery } from "metabase-enterprise/api";

import type { EntrySearchModel } from "../../constants";

import S from "./SearchModelPicker.module.css";
import { getSearchModelItems } from "./utils";

type SearchModelPickerProps = {
  searchModels: EntrySearchModel[];
  onSearchModelsChange: (models: EntrySearchModel[]) => void;
};

export function SearchModelPicker({
  searchModels,
  onSearchModelsChange,
}: SearchModelPickerProps) {
  const [isOpened, { toggle, close }] = useDisclosure();

  return (
    <Popover opened={isOpened} position="right" onDismiss={close}>
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          className={S.button}
          aria-label={t`Filter`}
          onClick={toggle}
        >
          <FixedSizeIcon c="text-primary" name="filter" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <SearchModelPopover
          searchModels={searchModels}
          onSearchModelsChange={onSearchModelsChange}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

type SearchModelPopoverProps = {
  searchModels: EntrySearchModel[];
  onSearchModelsChange: (models: EntrySearchModel[]) => void;
};

function SearchModelPopover({
  searchModels,
  onSearchModelsChange,
}: SearchModelPopoverProps) {
  const { data, isLoading } = useSearchQuery({
    models: ["card"],
    limit: 0,
    calculate_available_models: true,
    context: "dependencies",
  });
  const hasDataApps = useHasTokenFeature("data-apps");
  const { data: dataApps = [], isLoading: isLoadingDataApps } =
    useListDataAppsQuery(undefined, { skip: !hasDataApps });
  const items = data ? getSearchModelItems(data, dataApps) : [];

  const handleChange = (value: string[]) => {
    // the checkboxes' values are the items' models, which Checkbox.Group reports as strings
    onSearchModelsChange(value as EntrySearchModel[]);
  };

  return (
    <Box w="15rem" p="lg">
      {isLoading || isLoadingDataApps ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Checkbox.Group value={searchModels} onChange={handleChange}>
          <Stack gap="0.75rem">
            {items.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                label={item.label}
              />
            ))}
          </Stack>
        </Checkbox.Group>
      )}
    </Box>
  );
}
