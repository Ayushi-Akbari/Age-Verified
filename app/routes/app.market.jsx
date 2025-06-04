import React, {useState} from "react";
import {
  Page,
  Card,
  Button,
  Box,
  AppProvider,
  Modal,
  Select,
  Text,
  InlineError,
  Banner,
  Icon,
} from "@shopify/polaris";
import { Trash2, Info, AlertCircle } from "lucide-react";

const markets = [
  {
    flag: "🇮🇳",
    country: "India",
    primary: true,
    language: "English",
  },
  {
    flag: "🇦🇱",
    country: "Albania",
    primary: false,
    language: "Bosnian",
  },
  {
    flag: "🇮🇳",
    country: "India",
    primary: false,
    language: "Hindi",
  },
];

const countryOptions = [
  { label: "Select Country...", value: "" },
  { label: "India", value: "india" },
  { label: "Albania", value: "albania" },
];
const languageOptions = [
  { label: "Select Language...", value: "" },
  { label: "English", value: "english" },
  { label: "Bosnian", value: "bosnian" },
  { label: "Hindi", value: "hindi" },
];

export default function MarketsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <AppProvider>
      <Page>
        <div className="p-4 space-y-6">
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-custom text-gray-700">Markets</h1>

            <div className="flex gap-[10px]">
              <Button size="large">Support</Button>
              <Button variant="primary" size="large" onClick={() => setModalOpen(true)}>
                Add Markets
              </Button>
            </div>
          </div>

          <div>
            <Box>
              <div className="shadow-md rounded-xl overflow-hidden">
                <Card padding="0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full mt-4">
                      <thead>
                        <tr className="border-b">
                          <th className="pl-6"></th>
                          <th className="text-left pr-6 py-1 font-semibold text-gray-700">
                            Countries
                          </th>
                          <th className="text-left px-6 py-1 font-semibold text-gray-700">
                            Languages
                          </th>
                          <th className="text-center px-6 py-1 font-semibold text-gray-700">
                            Edit
                          </th>
                          <th className="text-center justify-center px-6 py-1 font-semibold text-gray-700">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {markets.map((market, idx) => (
                          <tr
                            key={idx}
                            className="border-b last:border-0 bg-white hover:bg-gray-50"
                          >
                            <td className="pl-6"><span className="text-2xl">{market.flag}</span></td>
                            <td className="h-12 flex items-center pr-6 py-2">
                              <div>
                                <div className="font-medium">
                                  {market.country}
                                </div>
                                {market.primary && (
                                  <div className="text-xs text-gray-500">
                                    Primary
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-2">{market.language}</td>
                            <td className="px-6 py-2 text-center">
                              <Button size="medium" variant="primary">
                                Edit
                              </Button>
                            </td>
                            <td className="px-6 py-2 text-center">
                              {!market.primary && (
                              <Button
                                size="medium"
                                variant="primary"
                                tone="critical"
                              >
                                Delete
                              </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </Box>
          </div>

          <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Markets"
          primaryAction={{
            content: "Add Market",
            onAction: () => {
              // handle add market logic here
              setModalOpen(false);
            },
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => setModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Text variant="bodyMd" as="label">
                    Select Country
                  </Text>
                  <Select
                    options={countryOptions}
                    value={country}
                    onChange={setCountry}
                  />
                </div>
                <div className="flex-1">
                  <Text variant="bodyMd" as="label">
                    Select Language
                  </Text>
                  <Select
                    options={languageOptions}
                    value={language}
                    onChange={setLanguage}
                  />
                </div>
              </div>
              <Banner
                status="info"
                title=""
                className="mt-2"
              >
                <Text as="span" variant="bodySm">
                  The popup for markets (countries) and their respective languages will only be displayed if the countries are set up in the Shopify Markets.
                </Text>
              </Banner>
            </div>
          </Modal.Section>
        </Modal>
        </div>
      </Page>
    </AppProvider>
  );
}