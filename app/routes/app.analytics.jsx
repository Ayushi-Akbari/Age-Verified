import React, { useEffect, useState, useCallback } from "react";
import {
  Page,
  Card,
  Button,
  Box,
  AppProvider,
  Modal,
  Select,
  Text,
  Banner,
  TextField,
  Popover,
  ActionList,
  DatePicker
} from "@shopify/polaris";
import { Trash2, Info, AlertCircle } from "lucide-react";
import en from '@shopify/polaris/locales/en.json';
import axios from 'axios'
import {  
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Cookies from 'js-cookie'
import {countryOptions, languageOptions} from "../component/market"

function formattedDateRange(date_range, date) {
  const today = new Date();
  let startDate, endDate;

  console.log("date_range : ", date_range);
  console.log("date : " , date);
  
  switch (date_range) {
    case "last_7_days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = new Date(today);
      break;

    case "last_30_days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      endDate = new Date(today);
      break;

    case "this_month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today);
      break;

    case "last_month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    case "custom_range":
      if (date && date[0] && date[0].startDate && date[0].endDate) {
        console.log("date in side switch ", date);

        const selection = date[0];
        startDate = selection.startDate;
        endDate = selection.endDate;
      } else {
        startDate = today;
        endDate = today;
      }
      break;

    default:
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = new Date(today);
  }

  // Strip time part
  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  function formatDateMMDDYYYY(date) {
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  return `${formatDateMMDDYYYY(startDate)} - ${formatDateMMDDYYYY(endDate)}`;
}

function convertDateRangeFormat(dateRange) {
  if (!dateRange) return ""; 
  const [start, end] = dateRange.split(" - ");
  const startFormatted = start.replace(/\//g, "-");
  const endFormatted = end.replace(/\//g, "-");
  return `${startFormatted} / ${endFormatted}`;
}

export default function AnalyticsPage() {
  const [value, setValue] = useState("");
  const [shop, setShop] = useState()
  const [analyticsData, setAnalyticsData] = useState()
  const [popoverActive, setPopoverActive] = useState(false);
  const [customPickerOpen, setCustomPickerOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("last_7_days");
  const [dateRange, setDateRange] = useState(formattedDateRange("last_7_days"))
  const [marketOptions, setMarketOptions] = useState([])
  const [market, setMarket] = useState()

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
  const today = new Date();

  const [{ month, year }, setDate] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );
  
  const dateRanges = [
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "Last 30 Days", value: "last_30_days" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Custom Range", value: "custom_range" },
  ];

  useEffect(() => {
    if (!shop) {
      const cookieShop = Cookies.get("shop");
      if (cookieShop) {
        setShop(cookieShop);
      }else{
        const url = new URL(window.location.href);
        const shopName = url.searchParams.get("shop");
        setShop(shopName);

        if (shopName) {
          Cookies.set('shop', shopName, { 
            expires: 7, 
            secure: true, 
            sameSite: 'None' 
          });

          const cookie = Cookies.get('shop');
          console.log("cookie:", cookie);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (shop) {
      fetchMarket();
    }
  }, [shop]);
  useEffect(() => {
    if (shop && market) {
      fetchData(selectedValue, null);
    }
  }, [shop, market, selectedValue]);

  const fetchData = async(value, date) => {
      if (value === 'custom_range') {
        if (date && typeof date === "string" && date.includes(" - ")) {
          value = convertDateRangeFormat(date);
        } else {
          return null;
        }
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_DATABASE_URL}analytics/get-analytics?shop=${shop}&date_range=${value}&market_id=${market}`
        );
        console.log("data.analyticsData : " , data.analyticsData);
        
        setAnalyticsData(data.analyticsData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
  }

  const fetchMarket = async() => {
      if(shop){
        console.log("shop : " , shop);
        
        const res = await axios.get(
          `${import.meta.env.VITE_DATABASE_URL}market/get-market?shop=${shop}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if(res.status === 200){
          const market = res.data.market.market
          const sortedMarket = [...market].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
          const marketOptions = sortedMarket.map((data) => ({
            label: `${countryOptions.find(opt => opt.value === data.country)?.label || data.country} (${languageOptions.find(opt => opt.value === data.language)?.label || data.language})${data.primary ? " (Primary)" : ""}`,
            value: data._id
          }));
          setMarketOptions(marketOptions);
          setMarket(marketOptions[0].value)
        }
      }
  }

  const togglePopover = () => setPopoverActive((open) => !open);

  const handleSelect = (value, date) => {      
      setSelectedValue(value);
      setDateRange(formattedDateRange(value, date));
    if (value === "custom_range") {
      setCustomPickerOpen(true);
    } else {
      setCustomPickerOpen(false);
      setPopoverActive(false);
    }

    if (
      (value === "custom_range" && date && date[0] && date[0].startDate && date[0].endDate) ||
      (value !== "custom_range")
    ) {
      if (shop) {
        fetchData(value, formattedDateRange(value, date) );
      }
    }
  };

  const handleDateRangeInput = (value) => {
    setSelectedValue("custom_range");
    setDateRange(value);

    const [startStr, endStr] = value.split(" - ");
    if (startStr && endStr) {
      const [sd, sm, sy] = startStr.split("/");
      const [ed, em, ey] = endStr.split("/");

      const start = new Date(`${sy}-${sm}-${sd}`);
      const end = new Date(`${ey}-${em}-${ed}`);

      if (!isNaN(start) && !isNaN(end)) {
        setSelectedDates({
          start,
          end,
        });

        setDate({
          month: start.getMonth(),
          year: start.getFullYear(),
        });
      }
    }
  };

  return (
    <>
      <AppProvider i18n={en}>
        <Page>
          <div className="p-4 space-y-6">
            <div className="flex items-end justify-between">
              <h1 className="text-2xl font-custom text-gray-700">Analytics</h1>

              <div className="flex gap-[10px]">
                <Button size="large">Support</Button>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/3">
                <Box paddingBlockStart="8">
                  <Card>
                    <Text variant="bodyMd" fontWeight="medium">
                      Markets
                    </Text>
                    <div className="mt-4">
                      <Select
                        options={marketOptions}
                        value={market}
                        onChange={(value) => {
                          setMarket(value);
                        }}
                      />
                    </div>
                  </Card>
                </Box>
              </div>
              <div className="w-1/3"></div>
              <div className="w-1/3"></div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/3">
                <Box paddingBlockStart="8">
                  <Card>
                    <Text
                      variant="bodyMd"
                      fontWeight="medium"
                      alignment="center"
                    >
                      Total verification
                    </Text>
                    <p className="text-center text-teal-600 text-xl font-semibold mt-4">
                      {analyticsData && analyticsData.total_verification
                        ? analyticsData.total_verification
                        : 0}
                    </p>
                  </Card>
                </Box>
              </div>
              <div className="w-1/3">
                <Box paddingBlockStart="8">
                  <Card>
                    <Text
                      variant="bodyMd"
                      fontWeight="medium"
                      alignment="center"
                    >
                      Verified
                    </Text>
                    <p className="text-center text-teal-600 text-xl font-semibold mt-4">
                      {analyticsData && analyticsData.verified_count
                        ? analyticsData.verified_count
                        : 0}
                    </p>
                  </Card>
                </Box>
              </div>
              <div className="w-1/3">
                <Box paddingBlockStart="8">
                  <Card>
                    <Text
                      variant="bodyMd"
                      fontWeight="medium"
                      alignment="center"
                    >
                      Unverified
                    </Text>
                    <p className="text-center text-teal-600 text-xl font-semibold mt-4">
                      {analyticsData && analyticsData.unverified_count
                        ? analyticsData.unverified_count
                        : 0}
                    </p>
                  </Card>
                </Box>
              </div>
            </div>

            <div>
              <Card>
                <div>
                  <div className="flex items-end justify-between">
                    <Text
                      variant="bodyMd"
                      fontWeight="medium"
                      alignment="center"
                    >
                      Verification status statistics
                    </Text>
                    <div className="flex justify-end">
                      <Popover
                        active={popoverActive}
                        activator={
                          <TextField
                            label=""
                            value={dateRange}
                            onChange={handleDateRangeInput}
                            onFocus={() => {
                              if (selectedValue === "custom_range") {
                                togglePopover();
                                setPopoverActive(true);
                                setCustomPickerOpen(true);
                              } else {
                                togglePopover();
                              }
                            }}
                            autoComplete="off"
                            fluidContent
                          />
                        }
                        onClose={() => setPopoverActive(false)}
                        preferredPosition="below"
                        fluidContent
                      >
                        <Popover.Pane fixed>
                        <Box padding="4">
                          {!customPickerOpen ? (
                            <div className="space-y-2">
                              {dateRanges.map(({ label, value }) => (
                                <button
                                  key={value}
                                  className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
                                    selectedValue === value
                                      ? "bg-blue-500 text-white"
                                      : ""
                                  }`}
                                  onClick={() => handleSelect(value)}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-row gap-8 w-[700px] my-5 mr-5">
                              <div className="space-y-4 min-w-[130px]">
                                {dateRanges.map(({ label, value }) => (
                                  <button
                                    key={value}
                                    className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
                                      selectedValue === value
                                        ? "bg-blue-500 text-white"
                                        : ""
                                    }`}
                                    onClick={() => handleSelect(value)}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end ml-0 w-full">
                                <DatePicker
                                  month={month}
                                  year={year}
                                  onChange={(range) => {
                                    setSelectedDates(range);
                                    const startDate = range.start;
                                    const endDate = range.end;

                                    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
                                      handleSelect('custom_range', [{
                                        startDate: startDate,
                                        endDate: endDate,
                                      }]);
                                      setCustomPickerOpen(false);
                                      setPopoverActive(false);
                                    }
                                  }}
                                  onMonthChange={handleMonthChange}
                                  selected={selectedDates}
                                  preferredPosition="below"
                                  preferredAlignment="left"
                                  multiMonth
                                  allowRange
                                  disableDatesAfter={new Date()}
                                />
                              </div>
                            </div>
                          )}
                        </Box>
                        </Popover.Pane>
                      </Popover>
                    </div>
                  </div>
                  <div className="mt-5">
                    {/* {mounted && ( */}
                    <div style={{ width: "100%", height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData && analyticsData.data}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            angle={-45}
                            textAnchor="end"
                            dy={10}
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                              fill: "#666",
                            }}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend
                            verticalAlign="top"
                            align="center"
                            style={{ marginTop: "5px" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Unverified"
                            stroke="#f44336"
                            strokeWidth={2.5}
                          />
                          <Line
                            type="monotone"
                            dataKey="Verified"
                            stroke="#4caf50"
                            strokeWidth={2.5}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Page>
      </AppProvider>
    </>
  );
}