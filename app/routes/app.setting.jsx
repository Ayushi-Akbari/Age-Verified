import {
  Page,
  Text,
  TextField,
  Select,
  Card,
  Box,
  DropZone,
  Thumbnail,
  RadioButton,
  Checkbox,
  Button,
  AppProvider,
  Spinner
} from "@shopify/polaris";
import { useEffect, useState, useCallback, useRef } from "react";
import Template1 from "./template1";
import Template2 from "./template2";
import Template3 from "./template3";
import Template4 from "./template4";
import Template5 from "./template5";
import { Trash2, Info, AlertCircle } from "lucide-react";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import Cookies from 'js-cookie'
import {countryOptions, languageOptions} from "../component/market"
// import { authenticate } from "../shopify.server";

export default function Setting() {
  const startTime = performance.now();
  const verificationRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [future, setFuture] = useState([]);
  const [history, setHistory] = useState([]);
  const [shop, setShop] = useState()
  const [loading, setLoading] =useState(false)
  const [marketOptions, setMarketOptions] = useState([])

  const initialState = {
    customization: {
      layout: "template1",
      age: "18",
      verify_method: "no-input",
      date_format: "european_date",
      popup_show: false,
    },
    title: {
      text: "Welcome!",
      text_weight: "400",
      fonts: "serif",
      text_size: 35,
      text_color: "#535050",
    },
    description: {
      text: "Please verify that you are 18 years of age or older to enter this site.",
      text_weight: "100",
      fonts: "sans-serif",
      text_size: 14,
      text_color: "#8d8686",
    },
    acceptButton: {
      text: "Yes, I’m under 18",
      fonts: "sans-serif",
      text_weight: "500",
      text_size: 14,
      text_color: "#ffffff",
      background_color: "#007f5f",
      border_color: "#007f5f",
      border_width: 1,
      border_radius: 6,
      redirect_url: "",
    },
    rejectButton: {
      text: "No, I’m over 18",
      fonts: "sans-serif",
      text_weight: "100",
      text_size: 14,
      text_color: "#000000",
      background_color: "#cccccc",
      border_color: "#cccccc",
      border_width: 1,
      border_radius: 6,
    },
    popUp: {
      height: "400",
      width: "620",
      border_radius: "20",
      border_width: "1",
      top_bottom_padding: "25",
      left_right_padding: "30",
    },
    popUpBackground: {
      background_color: "#ffffff",
      border_color: "#4e1818",
      background_opacity: "1",
      image_enabale: true,
      image: `${import.meta.env.VITE_DATABASE_URL}image/background_image.png`,
      imageFile: "",
    },
    outerPopUpBackground: {
      background_color: "#959aa3",
      outer_opacity: "0.8",
      image_enabale: false,
      image: null,
      imageFile: null,
    },
    popUpLogo: {
      show_logo: true,
      logo_square: false,
      image: `${import.meta.env.VITE_DATABASE_URL}image/logo.png`,
      imageFile: "",
    },
    policy: {
      checked: true,
      text: "",
    },
    monthlyAnalysis: false,
    advanced: {
      css: "",
      script: "",
    },
    displayCriteria: {
      page: "all-pages",
      count: 0,
      url: [],
    },
    imageFile: null,
    market: "",
  };
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  const errorMessage = {
    customization: {
      age: "",
    },
    title: {
      text_size: "",
    },
    description: {
      text_size: "",
    },
    acceptButton: {
      border_radius: "",
      border_width: "",
      text_size: "",
    },
    rejectButton: {
      border_radius: "",
      border_width: "",
      text_size: "",
    },
    popUp: {
      height: "",
      width: "",
      border_radius: "",
      border_width: "",
      top_bottom_padding: "",
      left_right_padding: "",
    },
    popUpBackground: {
      opacity: "",
    },
    outerPopUpBackground: {
      opacity: "",
    },
    displayCriteria: {
      url: "Please add a valid URL for the specific page.",
    },
  };
  const [error, setError] = useState(errorMessage);

  const [descriptionText, setDescriptionText] = useState(
    "Please verify that you are {{minimum_age}} years of age or older to enter this site.",
  );
  const [acceptButtonText, setAcceptButtonText] = useState(
    "Yes, I’m over {{minimum_age}}",
  );
  const [rejectButtonText, setRejectButtonText] = useState(
    "No, I’m under {{minimum_age}}",
  );

  const [ReactQuill, setReactQuill] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("hello from setting useEffect");

    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderDuration = endTime - startTime;
      console.log(
        `UI design load/render time setting page: ${renderDuration.toFixed(2)} ms`,
      );
    });

    import("react-quill").then((mod) => {
      setReactQuill(() => mod.default);
      import("react-quill/dist/quill.snow.css");
    });

    if (!shop) {
      const cookieShop = Cookies.get("shop");
      console.log("cookieShop : " , cookieShop);
      
      if (cookieShop) {
        setShop(cookieShop);
      }
    }
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  useEffect(() => {
    if (shop) {
      fetchMarket();
      fetchData();
    }
  }, [shop]);

  useEffect(() => {
  if (!hasChanges) return;

  const saveBar = document.getElementById("my-save-bar");
  saveBar?.show();

  const saveBtn = document.getElementById("save-button");
  const discardBtn = document.getElementById("discard-button");

  const handleSave = async () => {
    saveBtn?.setAttribute('loading', '');

    const setting = await addSetting();
    if (setting) {
      setHasChanges(false);
      saveBar?.hide();
      saveBtn?.removeAttribute('loading');
    }else{
      setHasChanges(true);
      saveBar?.hide();
      saveBtn?.removeAttribute('loading');
    }
  };

  const handleDiscard = async () => {
    console.log("Discarding...");
    discardBtn?.setAttribute('loading', '');

    const res = await removeSetting();
    console.log("res:", res);

    if (res) {
      setHasChanges(false);
      saveBar?.hide();
      discardBtn?.removeAttribute('loading');
    }
  };

  saveBtn?.addEventListener("click", handleSave);
  discardBtn?.addEventListener("click", handleDiscard);

  return () => {
    saveBtn?.removeEventListener("click", handleSave);
    discardBtn?.removeEventListener("click", handleDiscard);
  };
}, [hasChanges]);


  useEffect(() => {
    console.log("advanced in setting : " , state.advanced);
    
    const url = window.location.href;
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      console.log('ID found in URL:', id);
      setState((prev) =>({
        ...prev,
        market: id
      }))
    } 
  },[])

  useEffect(() => {
    if (!state.market && shop) {
      console.log("state.amrket  inside: " , state.market);
      fetchMarket();
    }
  }, [state.market]);

  const weightOptions = [
    { label: "Thin", value: "100" },
    { label: "Extra Light", value: "200" },
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semi Bold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extra Bold", value: "800" },
    { label: "Black", value: "900" },
  ];
  const fontOptions = [
    { label: "Sans", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Monospace", value: "monospace" },
    { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
  ];

  const handleDropZoneDrop = useCallback((acceptedFiles, section, key) => {
    const uploadedFile = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;

      if (section === "popUpLogo") {
        setState((prev) => ({
          ...prev,
          popUpLogo: {
            ...prev.popUpLogo,
            [key]: base64,
            [`${key}File`]: uploadedFile,
          },
        }));
      } else if (section === "popUpBackground") {
        setState((prev) => ({
          ...prev,
          popUpBackground: {
            ...prev.popUpBackground,
            [key]: base64,
            [`${key}File`]: uploadedFile,
          },
        }));
      } else if (section === "outerPopUpBackground") {
        setState((prev) => ({
          ...prev,
          outerPopUpBackground: {
            ...prev.outerPopUpBackground,
            [key]: base64,
            [`${key}File`]: uploadedFile,
          },
        }));
      }
      setHasChanges(true);
    };

    reader.readAsDataURL(uploadedFile);
  }, []);

  const handleSectionChange = (section, key, value) => {
    setState((prev) => {
      const updated = {
        ...prev,
        [section]:
          typeof prev[section] === "object" && prev[section] !== null
            ? { ...prev[section], [key]: value }
            : value,
      };

      return updated;
    });
    setHasChanges(true);    
  };

  const handleErrorMessage = (section, key, value) => {
    setError((prev) => {
      const updated = {
        ...prev,
        [section]:
          typeof prev[section] === "object" && prev[section] !== null
            ? { ...prev[section], [key]: value }
            : value,
      };

      return updated;
    });
  };

  const fetchData = async (value) => {
    if (!shop) {
      console.warn("No shop parameter, skipping fetchData");
      return;
    }
    console.log("import.meta.env.VITE_DATABASE_URL : ", import.meta.env.VITE_DATABASE_URL);
    
    const market = value || state.market;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DATABASE_URL}setting/get-setting?shop=${shop}&market_id=${market}`,
      );
      const settingData = data?.data?.settings;

      if (!settingData) {
        setState(initialState);
        setState((prev) => ({
          ...prev,
          market: market
        }));
        return true
      }

      const parsedSetting = {
        customization: settingData.customization
          ? JSON.parse(settingData.customization)
          : initialState.customization,
        title: settingData.title
          ? JSON.parse(settingData.title)
          : initialState.title,
        description: settingData.description
          ? JSON.parse(settingData.description)
          : initialState.description,
        acceptButton: settingData.acceptButton
          ? JSON.parse(settingData.acceptButton)
          : initialState.acceptButton,
        rejectButton: settingData.rejectButton
          ? JSON.parse(settingData.rejectButton)
          : initialState.rejectButton,
        popUp: settingData.popUp
          ? JSON.parse(settingData.popUp)
          : initialState.popUp,
        popUpBackground: settingData.popUpBackground
          ? JSON.parse(settingData.popUpBackground)
          : initialState.popUpBackground,
        outerPopUpBackground: settingData.outerPopUpBackground
          ? JSON.parse(settingData.outerPopUpBackground)
          : initialState.outerPopUpBackground,
        popUpLogo: settingData.popUpLogo
          ? JSON.parse(settingData.popUpLogo)
          : initialState.popUpLogo,
        policy: settingData.policy
          ? JSON.parse(settingData.policy)
          : initialState.policy,
        advanced: settingData.advanced
          ? JSON.parse(settingData.advanced)
          : initialState.advanced,
        displayCriteria: settingData.displayCriteria
          ? JSON.parse(settingData.displayCriteria)
          : initialState.displayCriteria,
        monthlyAnalysis:
          settingData.monthlyAnalysis ?? initialState.monthlyAnalysis,
        market: market,
      };

      if (
        parsedSetting.popUpBackground?.image &&
        !parsedSetting.popUpBackground.image.startsWith("http://localhost:8001")
      ) {
        parsedSetting.popUpBackground.image = `http://localhost:8001${parsedSetting.popUpBackground.image}`;
      }

      if (
        parsedSetting.outerPopUpBackground?.image &&
        !parsedSetting.outerPopUpBackground.image.startsWith(
          "http://localhost:8001",
        )
      ) {
        parsedSetting.outerPopUpBackground.image = `http://localhost:8001${parsedSetting.outerPopUpBackground.image}`;
      }

      if (
        parsedSetting.popUpLogo?.image &&
        !parsedSetting.popUpLogo.image.startsWith("http://localhost:8001")
      ) {
        parsedSetting.popUpLogo.image = `http://localhost:8001${parsedSetting.popUpLogo.image}`;
      }

      setState(parsedSetting);

      setHistory([]);
      setFuture([]);

      return true
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      return false
    }
  };

  const fetchMarket = async() => {
    if(shop){
      const res = await axios.get(
        `${import.meta.env.VITE_DATABASE_URL}market/get-market?shop=${shop}`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      const market = res.data.market.market

      const sortedMarket = [...market].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
      const marketOptions = sortedMarket.map((data) => ({
        label: `${countryOptions.find(opt => opt.value === data.country)?.label || data.country} (${languageOptions.find(opt => opt.value === data.language)?.label || data.language})${data.primary ? " (Primary)" : ""}`,
        value: data._id
      }));
      setMarketOptions(marketOptions);

      const primaryMarket = marketOptions[0]?.value;

      setState(prev => ({
        ...prev,
        market: prev.market !== "" ? prev.market : primaryMarket
      }));

      return primaryMarket;
    }
  }

  const addSetting = async () => {
    console.log("inside setting : " );

    let currentMarket = state.market;
    if (!currentMarket) {
      currentMarket = await fetchMarket();
    }
    
    const latestState = stateRef.current;
    const htmlContent = verificationRef.current?.getHtmlContent();
    const removeImages = (obj) => {
      const { image, ...rest } = obj;
      rest.imageFile = null;
      return rest;
    };
    const formData = new FormData();

    console.log("latestState : ", latestState.advanced);

    formData.append("popUpLogoImage", latestState.popUpLogo.imageFile);
    formData.append(
      "popUpBackgroundImage",
      latestState.popUpBackground.imageFile,
    );
    formData.append(
      "outerPopUpBackgroundImage",
      latestState.outerPopUpBackground.imageFile,
    );

    formData.append("customization", JSON.stringify(latestState.customization));
    formData.append("title", JSON.stringify(latestState.title));
    formData.append("description", JSON.stringify(latestState.description));
    formData.append("acceptButton", JSON.stringify(latestState.acceptButton));
    formData.append("rejectButton", JSON.stringify(latestState.rejectButton));
    formData.append("popUp", JSON.stringify(latestState.popUp));
    formData.append(
      "outerPopUpBackground",
      latestState.outerPopUpBackground.imageFile
        ? JSON.stringify(removeImages(latestState.outerPopUpBackground))
        : JSON.stringify(latestState.outerPopUpBackground),
    );
    formData.append(
      "popUpLogo",
      latestState.popUpLogo.imageFile
        ? JSON.stringify(removeImages(latestState.popUpLogo))
        : JSON.stringify(latestState.popUpLogo),
    );
    formData.append(
      "popUpBackground",
      latestState.popUpBackground.imageFile
        ? JSON.stringify(removeImages(latestState.popUpBackground))
        : JSON.stringify(latestState.popUpBackground),
    );
    formData.append("policy", JSON.stringify(latestState.policy));
    formData.append("advanced", JSON.stringify(latestState.advanced));
    formData.append(
      "displayCriteria",
      JSON.stringify(latestState.displayCriteria),
    );
    formData.append("market", latestState.market ? latestState.market: currentMarket );
    formData.append("monthlyAnalysis", latestState.monthlyAnalysis);
    formData.append("htmlContent", htmlContent);
    formData.append("type","setting")

    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    const response = await axios.post(
      `${import.meta.env.VITE_DATABASE_URL}setting/add-setting?shop=${shop}`,
      formData,
    );

    if (response.status === 200) {
      const data = fetchData();
      if(data.status === 200){
        return true
      }
      return true
    }
    return false
  };

  const removeSetting = async () => {
    try {
      const res = await fetchData();
      console.log("res : ", res);
      
      if (!res) {
        return false
      }

      return true;
    } catch (error) {
      console.error('Error while removing setting:', error);
      setState(initialState);
      return false;
    }
  };

  const handleMarketChnage = async (value) => {
    setState(prev => ({
      ...prev,
      market: value,
    }));
    await fetchData(value);
  }

  const setPrimaryMarket = async() => {
    try {
      const data = await axios.put(
        `${import.meta.env.VITE_DATABASE_URL}market/set-primary-market?shop=${shop}`, {id:state.market},
      );
      if(data.status === 200){
        fetchMarket()
      }
      return true
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      return false
    }
  }

  const data = {
    customization: state.customization,
    title: state.title,
    description: state.description,
    acceptButton: state.acceptButton,
    rejectButton: state.rejectButton,
    popUp: state.popUp,
    popUpBackground: state.popUpBackground,
    outerPopUpBackground: state.outerPopUpBackground,
    popUpLogo: state.popUpLogo,
    policy: state.policy,
    advanced: state.advanced,
    ref: verificationRef,
  };

  return (
    <AppProvider>
      <Page fullWidth>
        {/* in first 3 div change sm to lg */}
        <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
          {/* Left Section */}
          <div className="w-full lg:w-[38%] p-2 space-y-8">
            <Text variant="headingXl" as="h1">
              Settings
            </Text>

            {/* Customizations */}
            <Box paddingBlockStart="8">
              <Card>
                <Text variant="semibold">Markets</Text>
                <div className="mt-3 ">
                  <Select
                    options={marketOptions}
                    value={state.market}
                    onChange={(value) =>{
                        handleMarketChnage(value)
                    }}
                  />

                  {(() => {
                  const selectedMarket = marketOptions.find(
                    (option) => option.value === state.market
                  );

                  if (selectedMarket && !selectedMarket.label.includes("(Primary)")) {
                    return (
                      <div className="mt-2">
                          <Button variant="primary" onClick={setPrimaryMarket}>
                            Make Primary Market
                          </Button>
                      </div>
                    );
                  }
                  return null;
                })()}
                </div>
              </Card>
            </Box>

            {/* Customizations */}
            <Box paddingBlockStart="8">
              <Text Text variant="headingMd" as="h3">
                Customizations
              </Text>
              <Card>
                <Text variant="semibold">Pop-up Layouts</Text>
                <div className="flex gap-4 mt-5">
                  <RadioButton
                    label="Template 1"
                    checked={state.customization.layout === "template1"}
                    id="template1"
                    name="layout"
                    onChange={() =>
                      handleSectionChange(
                        "customization",
                        "layout",
                        "template1",
                      )
                    }
                  />
                  <RadioButton
                    label="Template 2"
                    checked={state.customization.layout === "template2"}
                    id="template2"
                    name="layout"
                    onChange={() =>
                      handleSectionChange(
                        "customization",
                        "layout",
                        "template2",
                      )
                    }
                  />
                  <RadioButton
                    label="Template 3"
                    checked={state.customization.layout === "template3"}
                    id="template3"
                    name="layout"
                    onChange={() =>
                      handleSectionChange(
                        "customization",
                        "layout",
                        "template3",
                      )
                    }
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <RadioButton
                    label="Template 4"
                    checked={state.customization.layout === "template4"}
                    id="template4"
                    name="layout"
                    onChange={() =>
                      handleSectionChange(
                        "customization",
                        "layout",
                        "template4",
                      )
                    }
                  />
                  <RadioButton
                    label="Template 5"
                    checked={state.customization.layout === "template5"}
                    id="template5"
                    name="layout"
                    onChange={() =>
                      handleSectionChange(
                        "customization",
                        "layout",
                        "template5",
                      )
                    }
                  />
                </div>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Text variant="semibold">Verification Settings</Text>
                <div className="flex flex-row flex-wrap items-center gap-4 mt-2">
                  <div className="flex-shrink-0">
                    <RadioButton
                      label="No Input "
                      checked={state.customization.verify_method === "no-input"}
                      id="no-input"
                      name="verify_method"
                      onChange={() =>
                        handleSectionChange(
                          "customization",
                          "verify_method",
                          "no-input",
                        )
                      }
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <RadioButton
                      label="Via Birthdate"
                      checked={
                        state.customization.verify_method === "via-birthdate"
                      }
                      id="via-birthdate"
                      name="verify_method"
                      onChange={() =>
                        handleSectionChange(
                          "customization",
                          "verify_method",
                          "via-birthdate",
                        )
                      }
                    />
                  </div>
                  <div className="w-[175px] flex-shrink-0">
                    <TextField
                      label="Age"
                      type="number"
                      inputMode="numeric"
                      value={state.customization.age}
                      onChange={(value) => {
                        if (value < 18 || value > 75) {
                          handleErrorMessage(
                            "customization",
                            "age",
                            "Age Value must be Between 18 to 75.",
                          );
                        } else {
                          handleErrorMessage("customization", "age", "");
                        }
                        const age = state.customization.age;
                        setState((prev) => ({
                          ...prev,
                          description: {
                            ...prev.description,
                            text: descriptionText.replace(
                              "{{minimum_age}}",
                              value,
                            ),
                          },
                          acceptButton: {
                            ...prev.acceptButton,
                            text: acceptButtonText.replace(
                              "{{minimum_age}}",
                              value,
                            ),
                          },
                          rejectButton: {
                            ...prev.rejectButton,
                            text: rejectButtonText.replace(
                              "{{minimum_age}}",
                              value,
                            ),
                          },
                        }));

                        handleSectionChange("customization", "age", value);
                      }}
                      suffix="Year(s)"
                    />
                    {error.customization.age && (
                      <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span className="break-words text-xs">
                          {error.customization.age}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                {state.customization.verify_method === "via-birthdate" && (
                  <>
                    <Text variant="semibold">Date Format</Text>
                    <div className="flex px-3 mt-3">
                      <div className="flex flex-row w-1/2">
                        <RadioButton
                          label=""
                          checked={
                            state.customization.date_format === "european_date"
                          }
                          id="european_date"
                          name="date_format"
                          onChange={() =>
                            handleSectionChange(
                              "customization",
                              "date_format",
                              "european_date",
                            )
                          }
                        />
                        <div className="flex flex-col text-xs">
                          European Date Format
                          <span className="text-xs text-gray-500">
                            (DD/MM/YYYY)
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row w-1/2">
                        <RadioButton
                          label=""
                          checked={
                            state.customization.date_format === "us_date"
                          }
                          id="us_date"
                          name="date_format"
                          onChange={() =>
                            handleSectionChange(
                              "customization",
                              "date_format",
                              "us_date",
                            )
                          }
                        />
                        <div className="flex flex-col text-xs">
                          US Date Format
                          <span className="text-xs text-gray-500">
                            (MM/DD/YYYY)
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="mt-5 mx-0 border-gray-300 mb-5" />
                  </>
                )}

                <Text variant="semibold">Pop-up Show Settings</Text>
                <div className="w-[200px] mt-2">
                  <Checkbox
                    label="Pop-up show every time"
                    checked={state.customization.popup_show}
                    onChange={() => {
                      handleSectionChange(
                        "customization",
                        "popup_show",
                        !state.customization.popup_show,
                      );
                    }}
                  />
                </div>
                <div className="flex border rounded-md bg-blue-100  p-2 gap-2 items-start">
                  <div className="w-8 h-4 rounded-md border-blue-100 flex items-center justify-center">
                    <Info size={16} className="text-blue-700" />
                  </div>
                  <span className="text-xm text-blue-950">
                    The pop-up will appear in every new session for both new and
                    existing users. In a single session, if the user clicks the
                    'Agree' button, the pop-up will not appear again during that
                    session, as it has already been accepted.
                    <br />
                  </span>
                </div>
              </Card>
            </Box>

            {/* Text Customizations */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Text Customizations
              </Text>

              {/* Title  */}
              <Card>
                <Box padding="4">
                  <Text variant="headingMd">Title</Text>

                  {/* Part 1 - Title Text */}
                  <div className="mb-4 mt-3">
                    <TextField
                      label="Text"
                      value={state.title.text}
                      onChange={(value) =>
                        handleSectionChange("title", "text", value)
                      }
                    />
                  </div>

                  {/* Part 2 - Font & Weight */}
                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <Select
                        label="Font"
                        options={fontOptions}
                        value={state.title.fonts}
                        onChange={(value) =>
                          handleSectionChange("title", "fonts", value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={state.title.text_weight}
                        onChange={(value) => {
                          handleSectionChange("title", "text_weight", value);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        value={state.title.text_size}
                        type="number"
                        inputMode="numeric"
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 26 || data > 60) {
                            handleErrorMessage(
                              "title",
                              "text_size",
                              "Text size Value must be Between 26 to 60.",
                            );
                          } else {
                            handleErrorMessage("title", "text_size", "");
                          }
                          handleSectionChange("title", "text_size", value);
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.title.text_size && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.title.text_size}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part 3 - Size & Color */}
                  <div className="flex gap-3">
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Text Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.title.text_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "title",
                                "text_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.title.text_color}
                          onChange={(e) => {
                            handleSectionChange(
                              "title",
                              "text_color",
                              e.target.value,
                            );
                          }}
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                  </div>
                </Box>

                <hr className="mt-7 mx-0 border-gray-300 mb-5" />

                {/* description */}
                <Box padding="4">
                  <Text variant="headingMd">Description</Text>

                  {/* Part 1 - Title Text */}
                  <div className="mb-4 mt-3">
                    <TextField
                      label="Text"
                      value={descriptionText}
                      onChange={(value) => {
                        const text = value.replace(
                          "{{minimum_age}}",
                          state.customization.age,
                        );

                        handleSectionChange("description", "text", text);
                        setDescriptionText(value);
                      }}
                    />
                  </div>

                  {/* Part 2 - Font & Weight */}
                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <Select
                        label="Font"
                        options={fontOptions}
                        value={state.description.fonts}
                        onChange={(value) =>
                          handleSectionChange("description", "fonts", value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={state.description.text_weight}
                        onChange={(value) =>
                          handleSectionChange(
                            "description",
                            "text_weight",
                            value,
                          )
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        type="number"
                        inputMode="numeric"
                        value={state.description.text_size}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 13 || data > 25) {
                            handleErrorMessage(
                              "description",
                              "text_size",
                              "Text size Value must be Between 13 to 25.",
                            );
                          } else {
                            handleErrorMessage("description", "text_size", "");
                          }
                          handleSectionChange(
                            "description",
                            "text_size",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.description.text_size && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.description.text_size}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part 3 - Size & Color */}
                  <div className="flex gap-4">
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Text Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.description.text_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "description",
                                "text_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.description.text_color}
                          onChange={(e) => {
                            handleSectionChange(
                              "description",
                              "text_color",
                              e.target.value,
                            );
                          }}
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                  </div>
                </Box>
              </Card>
            </Box>

            {/* Button Settings */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Button Settings
              </Text>

              {/* Accept Button  */}
              <Card>
                <Box padding="4">
                  <Text variant="headingMd">Accept Button</Text>

                  <div className="mb-4 mt-3">
                    <TextField
                      label="Text"
                      value={acceptButtonText}
                      onChange={(value) => {
                        const text = value.replace(
                          "{{minimum_age}}",
                          state.customization.age,
                        );
                        handleSectionChange("acceptButton", "text", text);
                        setAcceptButtonText(value);
                      }}
                    />
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <TextField
                        label="Border Radius"
                        type="number"
                        inputMode="numeric"
                        value={state.acceptButton.border_radius}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 30) {
                            handleErrorMessage(
                              "acceptButton",
                              "border_radius",
                              "Border radius Value must be Between 0 to 30.",
                            );
                          } else {
                            handleErrorMessage(
                              "acceptButton",
                              "border_radius",
                              "",
                            );
                          }
                          handleSectionChange(
                            "acceptButton",
                            "border_radius",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.acceptButton.border_radius && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.acceptButton.border_radius}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Width"
                        type="number"
                        inputMode="numeric"
                        value={state.acceptButton.border_width}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 10) {
                            handleErrorMessage(
                              "acceptButton",
                              "border_width",
                              "Border width Value must be Between 0 to 10.",
                            );
                          } else {
                            handleErrorMessage(
                              "acceptButton",
                              "border_width",
                              "",
                            );
                          }
                          handleSectionChange(
                            "acceptButton",
                            "border_width",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.acceptButton.border_width && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.acceptButton.border_width}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={state.acceptButton.text_weight}
                        onChange={(value) =>
                          handleSectionChange(
                            "acceptButton",
                            "text_weight",
                            value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <Select
                        label="Font"
                        options={fontOptions}
                        value={state.acceptButton.fonts}
                        onChange={(value) =>
                          handleSectionChange("acceptButton", "fonts", value)
                        }
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        type="number"
                        inputMode="numeric"
                        value={state.acceptButton.text_size}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 14 || data > 25) {
                            handleErrorMessage(
                              "acceptButton",
                              "text_size",
                              "Text size Value must be Between 14 to 25.",
                            );
                          } else {
                            handleErrorMessage("acceptButton", "text_size", "");
                          }
                          handleSectionChange(
                            "acceptButton",
                            "text_size",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.acceptButton.text_size && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.acceptButton.text_size}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Text Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.acceptButton.text_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "acceptButton",
                                "text_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.acceptButton.text_color}
                          onChange={(e) => {
                            handleSectionChange(
                              "acceptButton",
                              "text_color",
                              e.target.value,
                            );
                          }}
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Background Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.acceptButton.background_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "acceptButton",
                                "background_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.acceptButton.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "acceptButton",
                              "background_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Border Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          value={state.acceptButton.border_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                              handleSectionChange(
                                "acceptButton",
                                "border_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.acceptButton.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "acceptButton",
                              "border_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                </Box>

                <hr className="mt-7 mx-0 border-gray-300 mb-5" />

                {/* Reject Button */}
                <Box padding="4">
                  <Text variant="headingMd">Reject Button</Text>

                  <div className="mb-4 mt-3">
                    <TextField
                      label="Text"
                      value={rejectButtonText}
                      onChange={(value) => {
                        const text = value.replace(
                          "{{minimum_age}}",
                          state.customization.age,
                        );
                        handleSectionChange("rejectButton", "text", text);
                        setRejectButtonText(value);
                      }}
                    />
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <TextField
                        label="Border Radius"
                        type="number"
                        inputMode="numeric"
                        value={state.rejectButton.border_radius}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 30) {
                            handleErrorMessage(
                              "rejectButton",
                              "border_radius",
                              "Border radius Value must be Between 0 to 30.",
                            );
                          } else {
                            handleErrorMessage(
                              "rejectButton",
                              "border_radius",
                              "",
                            );
                          }
                          handleSectionChange(
                            "rejectButton",
                            "border_radius",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.rejectButton.border_radius && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.rejectButton.border_radius}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Width"
                        type="number"
                        inputMode="numeric"
                        value={state.rejectButton.border_width}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 10) {
                            handleErrorMessage(
                              "rejectButton",
                              "border_width",
                              "Border width Value must be Between 0 to 10.",
                            );
                          } else {
                            handleErrorMessage(
                              "rejectButton",
                              "border_width",
                              "",
                            );
                          }
                          handleSectionChange(
                            "rejectButton",
                            "border_width",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.rejectButton.border_width && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.rejectButton.border_width}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={state.rejectButton.text_weight}
                        onChange={(value) =>
                          handleSectionChange(
                            "rejectButton",
                            "text_weight",
                            value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <Select
                        label="Font"
                        options={fontOptions}
                        value={state.rejectButton.fonts}
                        onChange={(value) =>
                          handleSectionChange("rejectButton", "fonts", value)
                        }
                      ></Select>
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        type="number"
                        inputMode="numeric"
                        value={state.rejectButton.text_size}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 14 || data > 25) {
                            handleErrorMessage(
                              "rejectButton",
                              "text_size",
                              "Text size Value must be Between 14 to 25.",
                            );
                          } else {
                            handleErrorMessage("rejectButton", "text_size", "");
                          }
                          handleSectionChange(
                            "rejectButton",
                            "text_size",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.rejectButton.text_size && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.rejectButton.text_size}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Text Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.rejectButton.text_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "rejectButton",
                                "text_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.rejectButton.text_color}
                          onChange={(e) => {
                            handleSectionChange(
                              "rejectButton",
                              "text_color",
                              e.target.value,
                            );
                          }}
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Background Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.rejectButton.background_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "rejectButton",
                                "background_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.rejectButton.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "rejectButton",
                              "background_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1">
                        Border Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          value={state.rejectButton.border_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                              handleSectionChange(
                                "rejectButton",
                                "border_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.rejectButton.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "rejectButton",
                              "border_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>

                  <div className=" mt-2">
                    <TextField
                      label="Redirect Url"
                      value={state.rejectButton.redirect_url}
                      onChange={(value) =>
                        handleSectionChange(
                          "rejectButton",
                          "redirect_url",
                          value,
                        )
                      }
                    />
                  </div>
                </Box>
              </Card>
            </Box>

            {/* Pop-up setting */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Pop-up setting
              </Text>

              {/* Accept Button  */}
              <Card>
                <Box padding="4">
                  <Text variant="headingMd">Pop-up settings</Text>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <TextField
                        label="Heights"
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.height}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 50 || data > 650) {
                            handleErrorMessage(
                              "popUp",
                              "height",
                              "Heights Value must be Between 50 to 650.",
                            );
                          } else {
                            handleErrorMessage("popUp", "height", "");
                          }
                          handleSectionChange("popUp", "height", value);
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.height && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.height}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Width"
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.width}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 100 || data > 650) {
                            handleErrorMessage(
                              "popUp",
                              "width",
                              "Width Value must be Between 0 to 650.",
                            );
                          } else {
                            handleErrorMessage("popUp", "width", "");
                          }
                          handleSectionChange("popUp", "width", value);
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.width && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.width}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Radius"
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.border_radius}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 1 || data > 20) {
                            handleErrorMessage(
                              "popUp",
                              "border_radius",
                              "Border radius Value must be Between 1 to 20.",
                            );
                          } else {
                            handleErrorMessage("popUp", "border_radius", "");
                          }
                          handleSectionChange("popUp", "border_radius", value);
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.border_radius && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.border_radius}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <TextField
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                            Border Width
                          </span>
                        }
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.border_width}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 10) {
                            handleErrorMessage(
                              "popUp",
                              "border_width",
                              "Border width Value must be Between 0 to 10.",
                            );
                          } else {
                            handleErrorMessage("popUp", "border_width", "");
                          }
                          handleSectionChange("popUp", "border_width", value);
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.border_width && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.border_width}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        // label="Top And Bottom Padding"
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px] ">
                            Top And Bottom Padding
                          </span>
                        }
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.top_bottom_padding}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 50) {
                            handleErrorMessage(
                              "popUp",
                              "top_bottom_padding",
                              "Top and bottom padding Value must be Between 0 to 50",
                            );
                          } else {
                            handleErrorMessage(
                              "popUp",
                              "top_bottom_padding",
                              "",
                            );
                          }
                          handleSectionChange(
                            "popUp",
                            "top_bottom_padding",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.top_bottom_padding && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.top_bottom_padding}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <TextField
                        // label="Left And Right Padding"
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                            Left And Right Padding
                          </span>
                        }
                        type="number"
                        inputMode="numeric"
                        value={state.popUp.left_right_padding}
                        onChange={(value) => {
                          const data = parseInt(value, 10);
                          if (isNaN(data) || data < 0 || data > 50) {
                            handleErrorMessage(
                              "popUp",
                              "left_right_padding",
                              "Left and right padding Value must be Between 0 to 50.",
                            );
                          } else {
                            handleErrorMessage(
                              "popUp",
                              "left_right_padding",
                              "",
                            );
                          }
                          handleSectionChange(
                            "popUp",
                            "left_right_padding",
                            value,
                          );
                        }}
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                      {error.popUp.left_right_padding && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUp.left_right_padding}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Box>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Box padding="4">
                  <Text variant="headingMd">Popup Background</Text>

                  <div className="flex gap-2 mt-2 items-start">
                    {/* Background Color */}
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1 block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                        Background Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.popUpBackground.background_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "popUpBackground",
                                "background_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.popUpBackground.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "popUpBackground",
                              "background_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Border Color */}
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1 block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                        Border Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.popUpBackground.border_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "popUpBackground",
                                "border_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.popUpBackground.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "popUpBackground",
                              "border_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Background Layer Opacity */}
                      <TextField
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                            Background Layer Opacity
                          </span>
                        }
                        value={state.popUpBackground.background_opacity}
                        onChange={(value) => {
                          const data = parseFloat(value);
                          if (isNaN(data) || data < 0 || data > 1) {
                            handleErrorMessage(
                              "popUpBackground",
                              "background_opacity",
                              "Opacity value is between 0 to 1.",
                            );
                          } else {
                            handleErrorMessage(
                              "popUpBackground",
                              "background_opacity",
                              "",
                            );
                          }
                          handleSectionChange(
                            "popUpBackground",
                            "background_opacity",
                            value,
                          );
                        }}
                        suffix="Px"
                      />
                      {error.popUpBackground.background_opacity && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words text-xs">
                            {error.popUpBackground.background_opacity}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="w-[200px] mt-3">
                      <Checkbox
                        label="Enable Background Image"
                        checked={state.popUpBackground.image_enabale}
                        onChange={(value) =>
                          handleSectionChange(
                            "popUpBackground",
                            "image_enabale",
                            !state.popUpBackground.image_enabale,
                          )
                        }
                      />
                    </div>
                    {state.popUpBackground.image_enabale && (
                      <Box marginx="auto">
                        <DropZone
                          label=""
                          accept="image/*"
                          onDrop={(acceptedFiles) =>
                            handleDropZoneDrop(
                              acceptedFiles,
                              "popUpBackground",
                              "image",
                            )
                          }
                          allowMultiple={false}
                        >
                          <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                            {state.popUpBackground.image ? (
                              <>
                                <Thumbnail
                                  source={state.popUpBackground.image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setState((prev) => ({
                                      ...prev,
                                      popUpBackground: {
                                        ...prev.popUpBackground,
                                        image: null,
                                        imageFile: null,
                                      },
                                    }));
                                  }}
                                  className="absolute top-0 right-0 bg-white hover:bg-red-100 text-red-600 rounded-full p-1 shadow"
                                  title="Remove image"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            ) : (
                              <Text variant="bodyMd" color="subdued">
                                Upload an image
                              </Text>
                            )}
                          </div>
                        </DropZone>
                      </Box>
                    )}
                  </div>
                </Box>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Box padding="4">
                  <Text variant="headingMd">Outer Pop-up Background</Text>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1 flex-col">
                      <div className="text-[13px] text-[#333333] mb-1 block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                        Outer Layer Color
                      </div>
                      <div className="flex flex-1 items-center border border-[#8a8a8a] focus:border-[#303030] rounded-md ">
                        <input
                          type="text"
                          name="text_color"
                          value={state.outerPopUpBackground.background_color}
                          onChange={(e) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "outerPopUpBackground",
                                "background_color",
                                e.target.value,
                              );
                            }
                          }}
                          className="w-full text-sm focus:outline-none ml-2"
                        />
                        <input
                          type="color"
                          value={state.outerPopUpBackground.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "outerPopUpBackground",
                              "background_color",
                              e.target.value,
                            )
                          }
                          className="w-9 h-[30px] p-0 border-none rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex-1">
                        <TextField
                          label={
                            <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                              Background Layer Opacity
                            </span>
                          }
                          value={state.outerPopUpBackground.outer_opacity}
                          onChange={(value) => {
                            const data = parseFloat(value);
                            if (isNaN(data) || data < 0 || data > 1) {
                              handleErrorMessage(
                                "outerPopUpBackground",
                                "outer_opacity",
                                "Opacity value is between 0 to 1.",
                              );
                            } else {
                              handleErrorMessage(
                                "outerPopUpBackground",
                                "outer_opacity",
                                "",
                              );
                            }
                            handleSectionChange(
                              "outerPopUpBackground",
                              "outer_opacity",
                              value,
                            );
                          }}
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                        {error.outerPopUpBackground.outer_opacity && (
                          <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                            <AlertCircle
                              size={15}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="break-words text-xs">
                              {error.outerPopUpBackground.outer_opacity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>

                  <div>
                    <div className="mt-3">
                      <Checkbox
                        label="Enable Outer Background Image"
                        checked={state.outerPopUpBackground.image_enabale}
                        onChange={(value) =>
                          handleSectionChange(
                            "outerPopUpBackground",
                            "image_enabale",
                            !state.outerPopUpBackground.image_enabale,
                          )
                        }
                      />
                    </div>
                    {state.outerPopUpBackground.image_enabale && (
                      <Box marginx="auto">
                        <DropZone
                          label=""
                          accept="image/*"
                          onDrop={(acceptedFiles) =>
                            handleDropZoneDrop(
                              acceptedFiles,
                              "outerPopUpBackground",
                              "image",
                            )
                          }
                          allowMultiple={false}
                        >
                          <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                            {state.outerPopUpBackground.image ? (
                              <>
                                <Thumbnail
                                  source={state.outerPopUpBackground.image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setState((prev) => ({
                                      ...prev,
                                      outerPopUpBackground: {
                                        ...prev.outerPopUpBackground,
                                        image: null,
                                        imageFile: null,
                                      },
                                    }));
                                  }}
                                  className="absolute top-0 right-0 bg-white hover:bg-red-100 text-red-600 rounded-full p-1 shadow"
                                  title="Remove image"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            ) : (
                              <Text variant="bodyMd" color="subdued">
                                Upload an image
                              </Text>
                            )}
                          </div>
                        </DropZone>
                      </Box>
                    )}
                  </div>
                </Box>
              </Card>
            </Box>

            {/* Pop-up Logo Settings */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Pop-up Logo Settings
              </Text>
              <Card>
                <div className="flex gap-7">
                  <Checkbox
                    label="Show Logo"
                    checked={state.popUpLogo.show_logo}
                    onChange={(value) =>
                      handleSectionChange(
                        "popUpLogo",
                        "show_logo",
                        !state.popUpLogo.show_logo,
                      )
                    }
                  />
                  <Checkbox
                    label="Logo Square"
                    checked={state.popUpLogo.logo_square}
                    onChange={(value) =>
                      handleSectionChange(
                        "popUpLogo",
                        "logo_square",
                        !state.popUpLogo.logo_square,
                      )
                    }
                  />
                </div>
                {state.popUpLogo.show_logo && (
                  <Box marginx="auto">
                    <DropZone
                      label=""
                      accept="image/*"
                      onDrop={(acceptedFiles) =>
                        handleDropZoneDrop(acceptedFiles, "popUpLogo", "image")
                      }
                      allowMultiple={false}
                    >
                      <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                        {state.popUpLogo.image ? (
                          <>
                            <Thumbnail
                              source={state.popUpLogo.image}
                              alt="Uploaded image preview"
                              size="large"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setState((prev) => ({
                                  ...prev,
                                  popUpLogo: {
                                    ...prev.popUpLogo,
                                    image: null,
                                    imageFile: null,
                                  },
                                }));
                              }}
                              className="absolute top-0 right-0 bg-white hover:bg-red-100 text-red-600 rounded-full p-1 shadow"
                              title="Remove image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <Text variant="bodyMd" color="subdued">
                            Upload an image
                          </Text>
                        )}
                      </div>
                    </DropZone>
                  </Box>
                )}
              </Card>
            </Box>

            {/* Display Criteria */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Display Criteria
              </Text>
              <Card>
                <div className="flex gap-8">
                  <RadioButton
                    label="All Pages"
                    checked={state.displayCriteria.page === "all-pages"}
                    id="all-pages"
                    name="page"
                    onChange={() =>
                      handleSectionChange(
                        "displayCriteria",
                        "page",
                        "all-pages",
                      )
                    }
                  />
                  <RadioButton
                    label="Specific Pages"
                    checked={state.displayCriteria.page === "specific-pages"}
                    id="specific-pages"
                    name="page"
                    onChange={() =>
                      handleSectionChange(
                        "displayCriteria",
                        "page",
                        "specific-pages",
                      )
                    }
                  />

                  {state.displayCriteria.page === "specific-pages" && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleSectionChange(
                          "displayCriteria",
                          "count",
                          state.displayCriteria.count + 1,
                        )
                      }
                    >
                      Add URL
                    </Button>
                  )}
                </div>

                {state.displayCriteria.page === "specific-pages" && (
                  <div className="mt-2">
                    <Text variant="bodyMd" as="p">
                      Enter URL
                    </Text>
                    <div className="mt-2 w-9/10">
                      <TextField
                        label=""
                        value={state.displayCriteria.url?.[0] || ""}
                        onChange={(value) => {
                          const newUrls = [...state.displayCriteria.url];
                          newUrls[0] = value;
                          handleSectionChange(
                            "displayCriteria",
                            "url",
                            newUrls,
                          );
                        }}
                        autoComplete="off"
                      />
                      {!state.displayCriteria.url?.[0] && (
                        <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                          <AlertCircle size={18} className="mt-0.5 shrink-0" />
                          <span className="break-words">
                            {error.displayCriteria.url}
                          </span>
                        </div>
                      )}
                    </div>
                    {Array.from({ length: state.displayCriteria.count }).map(
                      (_, index) => (
                        <div className="mt-2 w-9/10">
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-grow">
                              <TextField
                                label=""
                                value={
                                  state.displayCriteria.url[index + 1] || ""
                                }
                                onChange={(value) => {
                                  const newUrls = [
                                    ...state.displayCriteria.url,
                                  ];
                                  newUrls[index + 1] = value;
                                  handleSectionChange(
                                    "displayCriteria",
                                    "url",
                                    newUrls,
                                  );
                                }}
                                autoComplete="off"
                              />
                            </div>

                            <Trash2
                              size={16}
                              className="cursor-pointer text-red-700 hover:text-red-900"
                              onClick={() => {
                                // console.log("index : ", index + 1);

                                const newUrls =
                                  state.displayCriteria.url.filter(
                                    (_, i) => i !== index + 1,
                                  );
                                // console.log("newUrls : ", newUrls);
                                handleSectionChange(
                                  "displayCriteria",
                                  "count",
                                  state.displayCriteria.count - 1,
                                );
                                handleSectionChange(
                                  "displayCriteria",
                                  "url",
                                  newUrls,
                                );
                              }}
                            />
                          </div>
                          {!state.displayCriteria.url[index + 1] && (
                            <div className="flex items-start gap-2 text-red-800 mt-1 w-full">
                              <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                              />
                              <span className="break-words">
                                {error.displayCriteria.url}
                              </span>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </Card>
            </Box>

            {/* Privacy Policy Setting */}
            <Box paddingBlockStart="8" marginy="auto">
              <Text variant="headingMd" as="h3">
                Privacy Policy Setting
              </Text>
              <Card>
                <Checkbox
                  label="Privacy Policy"
                  checked={state.policy.checked}
                  onChange={() =>
                    handleSectionChange(
                      "policy",
                      "checked",
                      !state.policy.checked,
                    )
                  }
                />
                {state.policy.checked && (
                  <Box maxWidth="400px" marginx="auto">
                    <div className="flex h-[210px] mt-4">
                      {/* Only render ReactQuill if loaded on client */}
                      {ReactQuill ? (
                        <ReactQuill
                          theme="snow"
                          checked={state.policy.text}
                          onChange={(value) =>
                            handleSectionChange("policy", "text", value)
                          }
                          style={{ height: "150px", width: "100%" }}
                        />
                      ) : (
                        <div>Loading editor...</div>
                      )}
                    </div>
                  </Box>
                )}
              </Card>
            </Box>

            {/* Monthly Analysis */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Monthly Analysis
              </Text>
              <Card>
                <div className="flex gap-7">
                  <Checkbox
                    label="I don't want to receive monthly analysis emails"
                    checked={state.monthlyAnalysis}
                    onChange={() =>
                      handleSectionChange(
                        "monthlyAnalysis",
                        null,
                        !state.monthlyAnalysis,
                      )
                    }
                  />
                </div>
              </Card>
            </Box>

            {/* Advanced Settings [Developers only] */}
            <Box paddingBlockStart="8">
              <Text variant="headingMd" as="h3">
                Advanced Settings [Developers only]
              </Text>

              {/* Accept Button  */}
              <Card>
                <Box padding="4">
                  <TextField
                    label="Custom css (Use this option to do a custom css where Age Verification doing anything)"
                    value={decodeURIComponent(escape(atob(state.advanced.css)))}
                    onChange={(value) =>{
                      const encodedCss = btoa(unescape(encodeURIComponent(value)));
                      handleSectionChange("advanced", "css", encodedCss)
                    }}
                    multiline={4}
                    autoComplete="off"
                  />
                </Box>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Box padding="4">
                  <TextField
                    label="Custom script (Use this option to do a custom script where Age Verification doing anything)"
                    value={atob(state.advanced.script)}
                    onChange={(value) =>{
                      const encodedScript = btoa(unescape(encodeURIComponent(value)));
                      handleSectionChange("advanced", "script", encodedScript)
                    }}
                    multiline={4}
                    autoComplete="off"
                  />
                </Box>
              </Card>
            </Box>
          </div>

          {/* Right Section */}
          <div className="flex flex-col w-full mb-5 lg:mt-0 lg:mb-0 lg:w-[62%] lg:h-screen lg:fixed lg:right-0 lg:top-0 lg:p-1 overflow-y-auto scrollbar-hide">
            <ui-save-bar id="my-save-bar">
              <button
                variant="primary"
                id="save-button"
                disabled={!hasChanges}
              >
                Save
              </button>
              <button
                id="discard-button"
                // disabled={loading}
              >
                {/* {loading ? "Discarding..." : "Discard"} */}
              </button>
            </ui-save-bar>

            <div className="mt-5 mb-10 right-4 flex justify-end space-x-4">
              <Button
                variant="primary"
                disabled={!hasChanges}
                onClick={() => {
                  addSetting();
                  document.getElementById("save-button").click();
                }}
              >
                Save
              </Button>
            </div>
            <div className="px-4 pb-8" key={state.customization.layout}>
              {state.customization.layout === "template1" ? (
                <Template1 ref={verificationRef} data={data} />
              ) : state.customization.layout === "template2" ? (
                <Template2 ref={verificationRef} data={data} />
              ) : state.customization.layout === "template3" ? (
                <Template3 ref={verificationRef} data={data} />
              ) : state.customization.layout === "template4" ? (
                <Template4 ref={verificationRef} data={data} />
              ) : state.customization.layout === "template5" ? (
                <Template5 ref={verificationRef} data={data} />
              ) : null}
            </div>
          </div>
        </div>
      </Page>
    </AppProvider>
  );
}
