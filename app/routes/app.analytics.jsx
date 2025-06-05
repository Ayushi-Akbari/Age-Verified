import React, { useEffect, useState } from "react";
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
  DatePicker,
  TextField,
  Popover,
  ActionList,
} from "@shopify/polaris";
import { Trash2, Info, AlertCircle } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
} from "date-fns";
import { defaultStaticRanges, createStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import axios from 'axios'
import {  
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Cookies from 'js-cookie'
import {countryOptions, languageOptions} from "../component/market"

const marketOptions = [{ label: "India (English) (Primary)", value: "india" }];

function formattedDateRange(date_range, date) {
  const today = new Date();
  let startDate, endDate;
  console.log("date  inside function: ", date);

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

        console.log("startDate : ", startDate);
        console.log("endDate : ", endDate);
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

  console.log("startDate : ", startDate);
  console.log("endDate : ", endDate);

  // Format function
  function formatDateMMDDYYYY(date) {
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  return `${formatDateMMDDYYYY(startDate)} - ${formatDateMMDDYYYY(endDate)}`;
}

function convertDateRangeFormat(dateRangeStr) {
  const [start, end] = dateRangeStr.split(" - ");
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

    const [start, end] = value.split(" - ");
    if (start && end) {
      const [sm, sd, sy] = start.split("/");
      const [em, ed, ey] = end.split("/");
      const startDate = new Date(`${sy}-${sm}-${sd}`);
      const endDate = new Date(`${ey}-${em}-${ed}`);
      if (!isNaN(startDate) && !isNaN(endDate)) {
        setRange([
          {
            startDate,
            endDate,
            key: "selection",
          },
        ]);
      }
    }
  };

  const fetchMarket = async() => {
      if(shop){
        const res = await axios.get(
          `http://localhost:8001/market/get-market?shop=${shop}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        const market = res.data.market.market
  
        const marketOptions = market.map((data) => ({
          label: `${countryOptions.find(opt => opt.value === data.country)?.label || data.country} (${languageOptions.find(opt => opt.value === data.language)?.label || data.language}) ${data.primary ? " (Primary)" : ""}`,
          value: data._id
        }));
        setMarketOptions(marketOptions);
        setMarket(marketOptions[0].value)
      }
  }

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
      }
    }
  }, [shop]);

  useEffect(() => {
    if(shop){
      fetchData(selectedValue, null)
      fetchMarket()
    }
  }, [shop]);

  const fetchData = async(value, date) => {
    (async () => {

      if(value === 'custom_range'){
        value = convertDateRangeFormat(date)  
      }
      try {
        const { data } = await axios.get(
          `http://localhost:8001/analytics/get-analytics?shop=${shop}&date_range=${value}&market_id=${market}`
        );
        setAnalyticsData(data.analyticsData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
    })();
  }

  return (
    <>
      <style>
        {`
        .rdrStaticRanges,
        .rdrDefinedRangesWrapper {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      
        .Polaris-Popover__Popover {
          min-width: 900px !important;   /* Increase width */
          width: 900px !important;
          max-width: 98vw !important;

          min-height: 600px !important;  /* Increase height */
          height: 600px !important;
          max-height: 90vh !important;

          overflow: hidden !important;   /* Hide scrollbars and content overflow */
          box-sizing: border-box;
          left: 10% !important;          /* Shift to left if needed */
          top: unset !important;         /* Remove top override if any */
          bottom: unset !important;
          transform: none !important;
          z-index: 9999 !important;
        }

        .rdrDateRangePickerWrapper {
          min-width: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          gap: 0 !important;
        }
        .rdrCalendarWrapper {
          width: 100% !important;
          min-width: 320px !important;
          max-width: none !important;
        }
  `}
      </style>

      <AppProvider>
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
                        onChange={(value) =>{
                          setMarket(value)
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
                      {analyticsData && analyticsData.total_verification ?  analyticsData.total_verification : 0}
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
                      {analyticsData && analyticsData.verified_count ?  analyticsData.verified_count : 0}
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
                      {analyticsData && analyticsData.unverified_count ?  analyticsData.unverified_count : 0}
                    </p>
                  </Card>
                </Box>
              </div>
            </div>

            <div>
              <Card>
                <div>
                <div className="flex items-end justify-between">
                  <Text variant="bodyMd" fontWeight="medium" alignment="center">
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
                          onFocus={togglePopover}
                          autoComplete="off"
                        />
                      }
                      onClose={() => setPopoverActive(false)}
                      preferredPosition="below"
                      fullHeight
                    >
                      <Popover.Pane fixed>
                      <Box padding="4">
                        {!customPickerOpen ? (
                          <div className="space-y-2">
                            {dateRanges.map(({ label, value }) => (
                              <button
                                key={value}
                                className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
                                   selectedValue === value ? "bg-blue-500 text-white" : ""
                                }`}
                                onClick={() => handleSelect(value)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="space-y-5 w-[810px]">
                            {dateRanges.map(({ label, value }) => (
                              <button
                                key={value}
                                className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
                                   selectedValue === value ? "bg-blue-500 text-white" : ""
                                }`}
                                onClick={() => handleSelect(value)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-end ml-0 w-full">
                            <DateRangePicker
                              ranges={range}
                              staticRanges={[]}
                              inputRanges={[]}
                              onChange={item => {
                                setRange([item.selection]);
                                handleSelect('custom_range', [item.selection]);
                              }}
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
                              style={{ fontSize: '12px', fontWeight: '400', fill: '#666' }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend
                              verticalAlign="top"
                              align="center"
                              style={{ marginTop: "5px" }}
                            />
                            <Line type="monotone" dataKey="Unverified" stroke="#f44336" strokeWidth={2.5} />
                            <Line type="monotone" dataKey="Verified" stroke="#4caf50" strokeWidth={2.5}/>
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