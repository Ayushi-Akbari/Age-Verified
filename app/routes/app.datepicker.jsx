import React, { useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Button,
  Modal,
  Select,
  Text,
  Box,
  DataTable,
  // Stack,
  Banner,
  Link,
} from "@shopify/polaris";

// You can move these to a separate file or fetch from API if needed
const countryOptions = [
  { label: "Select Country...", value: "" },
  { label: "India", value: "IN" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
  { label: "Canada", value: "CA" },
  // ...add more countries as needed
];

const languageOptions = [
  { label: "Select Language...", value: "" },
  { label: "English", value: "EN" },
  { label: "Hindi", value: "HI" },
  { label: "French", value: "FR" },
  { label: "German", value: "DE" },
  { label: "Spanish", value: "ES" },
  // ...add more languages as needed
];

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [countryError, setCountryError] = useState(false);
  const [languageError, setLanguageError] = useState(false);

  const handleAddMarket = () => {
    let hasError = false;
    if (!country) {
      setCountryError(true);
      hasError = true;
    }
    if (!language) {
      setLanguageError(true);
      hasError = true;
    }
    if (hasError) return;

    setMarkets([
      ...markets,
      {
        id: Date.now(),
        country: countryOptions.find((c) => c.value === country)?.label || "",
        language: languageOptions.find((l) => l.value === language)?.label || "",
      },
    ]);
    setCountry("");
    setLanguage("");
    setShowAddModal(false);
    setCountryError(false);
    setLanguageError(false);
  };

  const handleDeleteMarket = (id) => {
    setMarkets(markets.filter((m) => m.id !== id));
  };

  const rows = markets.map((market, idx) => [
    idx + 1,
    market.country,
    market.language,
    <Button plain onClick={() => setShowSettingsModal(true)} key={`edit-${market.id}`}>
      Edit
    </Button>,
    <Button plain destructive onClick={() => handleDeleteMarket(market.id)} key={`delete-${market.id}`}>
      Delete
    </Button>,
  ]);

  return (
    <AppProvider>
      <Page title="Markets">
        <Box paddingBlockEnd="400">
          <Card>
            {/* <Stack alignment="center" distribution="equalSpacing"> */}
              <Text variant="headingMd" as="h2">
                Markets
              </Text>
              <Button primary onClick={() => setShowAddModal(true)}>
                Add New Market
              </Button>
            {/* </Stack> */}
            <Box paddingBlockStart="400">
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                ]}
                headings={[
                  "",
                  "Countries",
                  "Languages",
                  "Edit",
                  "Delete",
                ]}
                rows={rows.length ? rows : [[
                  "", <Text as="span" color="subdued">No markets added yet.</Text>, "", "", ""
                ]]}
              />
            </Box>
          </Card>
        </Box>

        {/* Add Market Modal */}
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Markets"
          primaryAction={{
            content: "Add Market",
            onAction: handleAddMarket,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => setShowAddModal(false),
            },
          ]}
        >
          <Modal.Section>
            {/* <Stack vertical> */}
              <Box>
                <Select
                  label="Select Country"
                  options={countryOptions}
                  value={country}
                  onChange={(value) => {
                    setCountry(value);
                    setCountryError(false);
                  }}
                  error={countryError && "Country is required"}
                />
              </Box>
              <Box>
                <Select
                  label="Select Language"
                  options={languageOptions}
                  value={language}
                  onChange={(value) => {
                    setLanguage(value);
                    setLanguageError(false);
                  }}
                  error={languageError && "Language is required"}
                />
              </Box>
              <Banner status="info">
                <p>
                  The popup for markets (countries) and their respective languages will only be displayed if the countries are set up in the Shopify Markets.
                </p>
              </Banner>
            {/* </Stack> */}
          </Modal.Section>
        </Modal>

        {/* Settings Modal */}
        <Modal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="Markets settings"
          secondaryActions={[
            {
              content: "Close",
              onAction: () => setShowSettingsModal(false),
            },
          ]}
        >
          <Modal.Section>
            {/* <Stack spacing="tight"> */}
              <Link url="#" external>
                <Button primary>Entrance popup</Button>
              </Link>
              <Link url="#" external>
                <Button primary>Checkout verification</Button>
              </Link>
            {/* </Stack> */}
          </Modal.Section>
        </Modal>
      </Page>
    </AppProvider>
  );
}