// import React, {useState} from "react";
// import {
//   Page,
//   Card,
//   Button,
//   Box,
//   AppProvider,
//   Modal,
//   Select,
//   Text,
//   Banner,
//   DatePicker,
//   TextField,
//   Popover,
//   ActionList,
// } from "@shopify/polaris";
// import { Trash2, Info, AlertCircle } from "lucide-react";
// import { DateRangePicker } from "react-date-range";
// import { format } from "date-fns";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import moment from "moment";

//  const marketOptions = [
//     { label: "India (English) (Primary)", value: "india" },
//   ];

// export default function AnalyticsPage() {
// const [{ month, year }, setDate] = useState({ month: 5, year: 2025 });
//   const [selectedDates, setSelectedDates] = useState({
//     start: new Date(),
//     end: new Date(),
//   });
//   const [value, setValue] = useState("");

//   const [popoverActive, setPopoverActive] = useState(false);
//   const [customPickerOpen, setCustomPickerOpen] = useState(false);
//   const [selectedLabel, setSelectedLabel] = useState("Last 7 Days");
//   const [range, setRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       ranges: {
//           "Last 7 Days": [moment().subtract(6, "days"), moment()],
//           "Last 30 Days": [moment().subtract(29, "days"), moment()],
//           "This Month": [moment().startOf("month"), moment().endOf("month")],
//           "Last Month": [
//             moment().subtract(1, "month").startOf("month"),
//             moment().subtract(1, "month").endOf("month"),
//           ],
//           "Custom Range": []
//         },
//       key: "selection",
//     },
//   ]);
//   const togglePopover = () => setPopoverActive((open) => !open);

//    const handleSelect = (label) => {
//     setSelectedLabel(label);
//     if (label === "Custom Range") {
//       setCustomPickerOpen(true);
//     } else {
//       setCustomPickerOpen(false);
//       setPopoverActive(false);
//     }
//   };

//   const formatRange = () => {
//     const { startDate, endDate } = range[0];
//     return `${format(startDate, "MM/dd/yyyy")} - ${format(endDate, "MM/dd/yyyy")}`;
//   };


//   return (
//     <AppProvider>
//       <Page>
//         <div className="p-4 space-y-6">
//           <div className="flex items-end justify-between">
//             <h1 className="text-2xl font-custom text-gray-700">Analytics</h1>

//             <div className="flex gap-[10px]">
//               <Button size="large">Support</Button>
//             </div>
//           </div>

//           <div className="flex gap-5">
//             <div className="w-1/3">
//               <Box paddingBlockStart="8">
//                 <Card>
//                   <Text variant="bodyMd" fontWeight="medium">
//                     Markets
//                   </Text>
//                   <div className="mt-4">
//                     <Select
//                       options={marketOptions}
//                       // value={state.market}
//                       // onChange={(value) =>
//                       //   handleSectionChange("market", null, value)
//                       // }
//                     />
//                   </div>
//                 </Card>
//               </Box>
//             </div>
//             <div className="w-1/3"></div>
//             <div className="w-1/3"></div>
//           </div>

//           <div className="flex gap-5">
//             <div className="w-1/3">
//               <Box paddingBlockStart="8">
//                 <Card>
//                   <Text variant="bodyMd" fontWeight="medium" alignment="center">
//                     Total verification
//                   </Text>
//                   <p className="text-center text-teal-600 text-xl font-semibold mt-4">
//                     0
//                   </p>
//                 </Card>
//               </Box>
//             </div>
//             <div className="w-1/3">
//               <Box paddingBlockStart="8">
//                 <Card>
//                   <Text variant="bodyMd" fontWeight="medium" alignment="center">
//                     Verified
//                   </Text>
//                   <p className="text-center text-teal-600 text-xl font-semibold mt-4">
//                     0
//                   </p>
//                 </Card>
//               </Box>
//             </div>
//             <div className="w-1/3">
//               <Box paddingBlockStart="8">
//                 <Card>
//                   <Text variant="bodyMd" fontWeight="medium" alignment="center">
//                     Unverified
//                   </Text>
//                   <p className="text-center text-teal-600 text-xl font-semibold mt-4">
//                     0
//                   </p>
//                 </Card>
//               </Box>
//             </div>
//           </div>

//           <div>
//             <Card>
//               <div className="flex items-end justify-between">
//                 <Text variant="bodyMd" fontWeight="medium" alignment="center">
//                   Verification status statistics
//                 </Text>
//                 <div >
//                   <Popover
//                     active={popoverActive}
//                     activator={
//                       <Button onClick={togglePopover}>
//                         {selectedLabel === "Custom Range"
//                           ? formatRange()
//                           : selectedLabel}
//                       </Button>
//                     }
//                     onClose={() => setPopoverActive(false)}
//                     preferredAlignment="left"
//                   >
//                     <Box padding="4">
//                       {!customPickerOpen ? (
//                         <div className="space-y-2">
//                           {[
//                             "Last 7 Days",
//                             "Last 30 Days",
//                             "This Month",
//                             "Last Month",
//                             "Custom Range",
//                           ].map((label) => (
//                             <button
//                               key={label}
//                               className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
//                                 selectedLabel === label
//                                   ? "bg-blue-500 text-white"
//                                   : ""
//                               }`}
//                               onClick={() => handleSelect(label)}
//                             >
//                               {label}
//                             </button>
//                           ))}
//                         </div>
//                       ) : (
                        
//                         <div className="flex">
//                           {/* <div className="space-y-2">
//                           {[
//                             "Last 7 Days",
//                             "Last 30 Days",
//                             "This Month",
//                             "Last Month",
//                             "Custom Range",
//                           ].map((label) => (
//                             <button
//                               key={label}
//                               className={`block w-full text-left px-4 py-1 rounded hover:bg-gray-200 hover:text-black ${
//                                 selectedLabel === label
//                                   ? "bg-blue-500 text-white"
//                                   : ""
//                               }`}
//                               onClick={() => handleSelect(label)}
//                             >
//                               {label}
//                             </button>
//                           ))}
//                         </div> */}
//                           <DateRangePicker
//                             // onChange={(item) => setRange([item.selection])}
//                             ranges={range}
//                             staticRanges={[]}
//                             inputRanges={[]} 
//                           />
//                           <div className="flex justify-end gap-2 mt-2">
//                             <Button onClick={() => setPopoverActive(false)}>
//                               Cancel
//                             </Button>
//                             <Button
//                               primary
//                               onClick={() => {
//                                 setPopoverActive(false);
//                               }}
//                             >
//                               Apply
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </Box>
//                   </Popover>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </Page>
//     </AppProvider>
//   );
// }