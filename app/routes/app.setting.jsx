import {
  Page,
  Layout,
  Text,
  TextField,
  Select,
  Card,
  Box,
  DropZone,
  Thumbnail,
  ChoiceList,
  RadioButton,
  Checkbox,
  Button,
  AppProvider
} from "@shopify/polaris";
import { useEffect, useState, useCallback, useRef  } from "react";
import Template1 from "./app.template1";
import Template2 from "./app.template2";
import Template3 from "./app.template3";
import Template4 from "./app.template4";
import Template5 from "./app.template5";
import { Trash2, Info, AlertCircle  } from "lucide-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import axios from 'axios';

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);  
  const shop = new URL(request.url).searchParams.get("shop");
  
  return {admin, shop}
}

export default function Setting() {
  const startTime = performance.now(); 
  const verificationRef = useRef(null);
  const {shop} = useLoaderData()
  const [hasChanges, setHasChanges] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null)
  const [customization, setCustomization] = useState({
    layout: "template1",
    age: "18",
    verify_method: "no-input",
    date_fromat: "european_date",
    popup_show: false
  });
  const [title, setTitle] = useState({
    text: "Welcome!",
    text_weight: "700",
    fonts: "sans-serif",
    text_size: 20,
    text_color: "#505050",
  });
  const [description, setDescription] = useState({
    text: `Please verify that you are ${customization.age} years of age or older to enter this site.`,
    text_weight: "400",
    fonts: "sans-serif",
    text_size: 12,
    text_color: "#505050",
  });
  const [rejectButton, setRejectButton] = useState({
    text: `No, I’m under ${customization.age}`,
    fonts: "sans-serif",
    text_weight: "100",
    text_size: 14,
    text_color: "#000000",
    background_color: "#ffffff",
    border_color: "#cccccc",
    border_width: 1,
    border_radius: 6,
    redirect_url: "",
  });
  const [acceptButton, setAcceptButton] = useState({
    text: `Yes, I’m over ${customization.age}`,
    fonts: "sans-serif",
    text_weight: "100",
    text_size: 14,
    text_color: "#000000",
    background_color: "#ffffff",
    border_color: "#cccccc",
    border_width: 1,
    border_radius: 6,
  });
  const [popUp, setPopUp] = useState({
    height: "550",
    width: "420",
    border_readius: "0",
    border_width: "1",
    top_bottom_padding: "25",
    left_right_padding: "30"
  })
  const [popUpBackground, setPopUpBackground] = useState({
    background_color: "#2c2929",
    border_color: "#2c2929",
    background_opacity: "0.8",
    image_enabale: true,
    image: null,
    imageFile: null
  })
  const [outerPopUpBackground, setOuterPopUpBackground] = useState({
    background_color: "#2c2929",
    outer_opacity: "0.8",
    image_enabale: true,
    image: null,
    imageFile: null
  })
  const [popUpLogo, setPopUpLogo] = useState({
    show_logo: true,
    logo_square: true,
    image: null,
    imageFile: null
  })
  const [policy, setPolicy] = useState({
    checked: true,
    text: ""
  })
  const [monthlyAnalysis, setMonthlyAnalysis] = useState(false)
  const [advanced, setAdvanced] = useState({
    css: "",
    script: ""
  })
  const [displayCriteria, setDisplayCriteria] = useState({
    page: 'all-pages',
    count: 0,
    url: []
  });
  const [market, setMarket] = useState('india')

  const [descriptionText, setDescriptionText] = useState("Please verify that you are {{minimum_age}} years of age or older to enter this site.",);
  const [acceptButtonText, setAcceptButtonText] = useState("Yes, I’m over {{minimum_age}}");
  const [rejectButtonText, setRejectButtonText] = useState("No, I’m under {{minimum_age}}");

  const [ReactQuill, setReactQuill] = useState(null);
  const [value, setValue] = useState("");

   useEffect(() => {
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderDuration = endTime - startTime;
      console.log(`UI design load/render time setting page: ${renderDuration.toFixed(2)} ms`);
    });
  }, []);

  useEffect(() => {
    let isCancelled = false;
  
    if (!isCancelled) {
      fetchData();
      isCancelled = true;
    }
  
    return () => {
      isCancelled = true;
    };
  }, [shop]);

  useEffect(() => {
    import("react-quill").then((mod) => {
      setReactQuill(() => mod.default);
      import("react-quill/dist/quill.snow.css");
    });

    console.log("store Name : ", shop);

    console.log("outerPopUpBackground : " , outerPopUpBackground);
    
    
  }, []);

  useEffect(() => {
    if (!hasChanges) return;

    const saveBar = document.getElementById('my-save-bar');
    saveBar?.show();

    const saveBtn = document.getElementById('save-button');
    const discardBtn = document.getElementById('discard-button');

    const handleSave = () => {
      console.log('Saving');
      addSetting()
      setHasChanges(false);
      saveBar?.hide();
    };

    const handleDiscard = () => {
      console.log('Discarding');
      removeSetting()
      setHasChanges(false);
      saveBar?.hide();
    };

    saveBtn?.addEventListener('click', handleSave);
    discardBtn?.addEventListener('click', handleDiscard);

    return () => {
      saveBtn?.removeEventListener('click', handleSave);
      discardBtn?.removeEventListener('click', handleDiscard);
    };
  }, [hasChanges]);
  
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
  const marketOptions= [
    { label: "India (English) (Primary)", value: "india"}
  ]
    
  const handleDropZoneDrop = useCallback((acceptedFiles, section, key) => {
    const uploadedFile = acceptedFiles[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64 = reader.result;
  
      if (section === "popUpLogo") {
        setPopUpLogo(prev => ({
          ...prev,
          [key]: base64,
          [`${key}File`]: uploadedFile
        }));
      } else if (section === "popUpBackground") {
        setPopUpBackground(prev => ({
          ...prev,
          [key]: base64,
          [`${key}File`]: uploadedFile
        }));
      } else if (section === "outerPopUpBackground") {
        setOuterPopUpBackground(prev => ({
          ...prev,
          [key]: base64,
          [`${key}File`]: uploadedFile
        }));
      }

      setHasChanges(true);
    };
  
    reader.readAsDataURL(uploadedFile);
  }, []);
    
  const handleSectionChange = (section, key, value) => {
    if (section === 'market') {
      setMarket(value);
    } else if (section === 'customization') {
      setCustomization(prev => ({ ...prev, [key]: value }));
    } else if (section === 'title') {
      setTitle(prev => ({ ...prev, [key]: value }));
    } else if (section === 'description') {
      setDescription(prev => ({ ...prev, [key]: value }));
    } else if (section === 'acceptButton') {
      setAcceptButton(prev => ({ ...prev, [key]: value }));
    } else if (section === 'rejectButton') {
      setRejectButton(prev => ({ ...prev, [key]: value }));
    } else if (section === "popUp") {
      setPopUp(prev => ({ ...prev, [key]: value }));
    } else if (section === "popUpBackground") {
      setPopUpBackground(prev => ({ ...prev, [key]: value }));
    } else if (section === "outerPopUpBackground") {
      setOuterPopUpBackground(prev => ({ ...prev, [key]: value }));
    } else if (section === "displayCriteria") {
      setDisplayCriteria(prev => ({ ...prev, [key]: value }));
    } else if (section === "policy") {    
      setPolicy(prev => ({ ...prev, [key]: value }));
    } else if (section === "monthlyAnalysis") {
      setMonthlyAnalysis(prev => (value));
    } else if (section === "advanced") {
      setAdvanced(prev => ({ ...prev, [key]: value }));
    } else if (section === "popUpLogo") {
      setPopUpLogo(prev => ({ ...prev, [key]: value }));
    } 
    setHasChanges(true);
  };

  const fetchData = async () => {
    const data = await axios.get(`http://localhost:8001/setting/get-setting?shop=${shop}`)
    if(data){
      const settingData = data.data.data.settings
      const parsedSetting = {
        ...settingData,
        customization: settingData.customization ? JSON.parse(settingData.customization) : null,
        title: settingData.title ? JSON.parse(settingData.title) : null,
        description: settingData.description ? JSON.parse(settingData.description) : null,
        acceptButton: settingData.acceptButton ? JSON.parse(settingData.acceptButton) : null,
        rejectButton: settingData.rejectButton ? JSON.parse(settingData.rejectButton) : null,
        popUp: settingData.popUp ? JSON.parse(settingData.popUp) : null,
        popUpBackground: settingData.popUpBackground ? JSON.parse(settingData.popUpBackground) : null,
        outerPopUpBackground: settingData.outerPopUpBackground ? JSON.parse(settingData.outerPopUpBackground) : null,
        popUpLogo: settingData.popUpLogo ? JSON.parse(settingData.popUpLogo) : null,
        policy: settingData.policy ? JSON.parse(settingData.policy) : null,
        advanced: settingData.advanced ? JSON.parse(settingData.advanced) : null,
        displayCriteria: settingData.displayCriteria ? JSON.parse(settingData.displayCriteria) : null,
        monthlyAnalysis: settingData.monthlyAnalysis ? settingData.monthlyAnalysis: null,
        market: settingData.market ? settingData.market: null
      };

      // console.log("parsedSetting : ", parsedSetting);
       
      parsedSetting.customization && setCustomization(parsedSetting.customization);
      parsedSetting.title && setTitle(parsedSetting.title);
      parsedSetting.description && setDescription(parsedSetting.description);
      parsedSetting.acceptButton && setAcceptButton(parsedSetting.acceptButton);
      parsedSetting.rejectButton && setRejectButton(parsedSetting.rejectButton);
      parsedSetting.popUp && setPopUp(parsedSetting.popUp);
      parsedSetting.popUpBackground && setPopUpBackground(parsedSetting.popUpBackground);
      parsedSetting.outerPopUpBackground && setOuterPopUpBackground(parsedSetting.outerPopUpBackground);
      parsedSetting.popUpLogo && setPopUpLogo(parsedSetting.popUpLogo);
      parsedSetting.policy && setPolicy(parsedSetting.policy);
      parsedSetting.advanced && setAdvanced(parsedSetting.advanced);
      parsedSetting.displayCriteria && setDisplayCriteria(parsedSetting.displayCriteria);
      parsedSetting.monthlyAnalysis && setMonthlyAnalysis(parsedSetting.monthlyAnalysis);
      parsedSetting.market && setMarket(parsedSetting.market);

      console.log("..............................................");
      

      console.log("popup logo inside fetch : ", popUpLogo);

      console.log("PopUpBackground inside fetch : ", popUpBackground);

      console.log("outerPopUpBackground inside fetch : ", outerPopUpBackground);


        console.log("..............................................");


      

      if (parsedSetting.popUpBackground.image) {
        const path = parsedSetting.popUpBackground.image; 
        setPopUpBackground((prev) => ({
          ...prev,
          image: `http://localhost:8001${path}`,
        }));
      }
      if (parsedSetting.outerPopUpBackground.image) {
        const path = parsedSetting.outerPopUpBackground.image; 
        setOuterPopUpBackground((prev) => ({
          ...prev,
          image: `http://localhost:8001${path}`,
        }));
      }
      if (parsedSetting.popUpLogo.image) {
        const path = parsedSetting.popUpLogo.image;
        console.log("----------------");
         
          console.log("popUpLogo.image : ", popUpLogo);

        setPopUpLogo((prev) => ({
          ...prev,
          image: `http://localhost:8001${path}`,
        }));
        
        console.log("popUpLogo.image : ", popUpLogo);
        
      }
    }

  };

  const addSetting = async () => {

    const htmlContent = verificationRef.current?.getHtmlContent();
    
    const removeImages = (obj) => {
      console.log("obj : ", obj);
      
      const { image, ...rest } = obj;

      rest.imageFile = null;

      console.log("rest : ", rest);
      
      return rest;
    };    
    const formData = new FormData();

    console.log("----------------------------------");
    
    console.log("outerPopUpBackground", outerPopUpBackground)

    console.log("popUpBackground", popUpBackground)

    console.log("popUpLogo", popUpLogo);

    formData.append("popUpLogoImage", popUpLogo.imageFile)
    formData.append("popUpBackgroundImage", popUpBackground.imageFile)
    formData.append("outerPopUpBackgroundImage", outerPopUpBackground.imageFile)


    console.log("popUpLogo.imageFile : ", popUpLogo.imageFile);

        console.log("----------------------------------");

    
    formData.append("customization", JSON.stringify(customization));
    formData.append("title", JSON.stringify(title));
    formData.append("description", JSON.stringify(description));
    formData.append("acceptButton", JSON.stringify(acceptButton));
    formData.append("rejectButton", JSON.stringify(rejectButton));
    formData.append("popUp", JSON.stringify(popUp));
    formData.append("outerPopUpBackground", JSON.stringify(removeImages(outerPopUpBackground)));
    formData.append("popUpLogo", JSON.stringify(removeImages(popUpLogo)));
    formData.append("popUpBackground", JSON.stringify(removeImages(popUpBackground)));
    formData.append("policy", JSON.stringify(policy));
    formData.append("advanced", JSON.stringify(advanced));
    formData.append("displayCriteria", JSON.stringify(displayCriteria));
    formData.append("market", market);
    formData.append("monthlyAnalysis", monthlyAnalysis);
    formData.append("htmlContent", htmlContent)

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await axios.post(
      `http://localhost:8001/setting/add-setting?shop=${shop}`,
      formData,
    );

    console.log("response : ", response);
    if(response.status === 200){
      fetchData()
    }
  };

  const removeSetting = async () =>{
    window.location.reload();
  }

  const data = {
  image,
  customization,
  title,
  description,
  acceptButton,
  rejectButton,
  popUp,
  popUpBackground,
  outerPopUpBackground,
  popUpLogo,
  policy,
  advanced,
  ref: verificationRef,
};
  
  return (
    <AppProvider>
      <Page fullWidth>
        {/* in first 3 div change sm to lg */}
        <div className="flex flex-col-reverse sm:flex-row w-full min-h-screen">
          {/* Left Section */}
          <div className="w-full sm:w-[38%] p-2 space-y-8">
            <Text variant="headingXl" as="h1">
              Settings
            </Text>

            {/* Customizations */}
            <Box paddingBlockStart="8">
              <Card>
                <Text variant="semibold">Markets</Text>
                <div className="mt-2 ">
                  <Select
                    label="Font"
                    options={marketOptions}
                    value={market}
                    onChange={(value) =>
                      handleSectionChange("market", null, value)
                    }
                  />
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
                    checked={customization.layout === "template1"}
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
                    checked={customization.layout === "template2"}
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
                    checked={customization.layout === "template3"}
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
                    checked={customization.layout === "template4"}
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
                    checked={customization.layout === "template5"}
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
                <div className="flex flex-row flex-wrap items-end gap-4 mt-2">
                  <div className="flex-shrink-0">
                    <RadioButton
                      label="No Input "
                      checked={customization.verify_method === "no-input"}
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
                      checked={customization.verify_method === "via-birthdate"}
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
                      value={customization.age}
                      onChange={(value) => {
                        console.log("customization.age : ", customization.age);
                        const age = customization.age;

                        console.log("value : ", value);

                        setRejectButton((prev) => ({
                          ...prev,
                          text: rejectButtonText.replace(
                            "{{minimum_age}}",
                            value,
                          ),
                        }));

                        setAcceptButton((prev) => ({
                          ...prev,
                          text: acceptButtonText.replace(
                            "{{minimum_age}}",
                            value,
                          ),
                        }));

                        setDescription((prev) => ({
                          ...prev,
                          text: descriptionText.replace(
                            "{{minimum_age}}",
                            value,
                          ),
                        }));

                        handleSectionChange("customization", "age", value);

                        console.log("rejectButton.text : ", rejectButton.text);
                        console.log("acceptButton.text : ", acceptButton.text);
                        console.log("description.text : ", description.text);
                        console.log("customization.age : ", customization.age);
                      }}
                      suffix="Year(s)"
                    />
                  </div>
                </div>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                {customization.verify_method === "via-birthdate" && (
                  <>
                    <Text variant="semibold">Date Format</Text>
                    <div className="flex px-3 mt-3">
                      <div className="flex flex-row w-1/2">
                        <RadioButton
                          label=""
                          checked={
                            customization.date_fromat === "european_date"
                          }
                          id="european_date"
                          name="date_fromat"
                          onChange={() =>
                            handleSectionChange(
                              "customization",
                              "date_fromat",
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
                          checked={customization.date_fromat === "us_date"}
                          id="us_date"
                          name="date_fromat"
                          onChange={() =>
                            handleSectionChange(
                              "customization",
                              "date_fromat",
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
                    checked={customization.popup_show}
                    onChange={() => {
                      handleSectionChange(
                        "customization",
                        "popup_show",
                        !customization.popup_show,
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
                      value={title.text}
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
                        value={title.fonts}
                        onChange={(value) =>
                          handleSectionChange("title", "fonts", value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={title.text_weight}
                        onChange={(value) => {
                          handleSectionChange("title", "text_weight", value);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        value={title.text_size}
                        onChange={(value) =>
                          handleSectionChange("title", "text_size", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>
                  </div>

                  {/* Part 3 - Size & Color */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TextField
                          label="Text Color"
                          value={title.text_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange("title", "text_color", value);
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={title.text_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "title",
                              "text_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 30,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
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
                          customization.age,
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
                        value={description.fonts}
                        onChange={(value) =>
                          handleSectionChange("description", "fonts", value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={description.text_weight}
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
                        value={description.text_size}
                        onChange={(value) =>
                          handleSectionChange("description", "text_size", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>
                  </div>

                  {/* Part 3 - Size & Color */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TextField
                          label="Text Color"
                          value={description.text_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "description",
                                "text_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={description.text_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "description",
                              "text_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 30,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
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
                          customization.age,
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
                        value={acceptButton.border_radius}
                        onChange={(value) =>
                          handleSectionChange(
                            "acceptButton",
                            "border_radius",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Width"
                        value={acceptButton.border_width}
                        onChange={(value) =>
                          handleSectionChange(
                            "acceptButton",
                            "border_width",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={acceptButton.text_weight}
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
                        value={acceptButton.fonts}
                        onChange={(value) =>
                          handleSectionChange("acceptButton", "fonts", value)
                        }
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        value={acceptButton.text_size}
                        onChange={(value) =>
                          handleSectionChange(
                            "acceptButton",
                            "border_size",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <TextField
                          label="Text Color"
                          value={acceptButton.text_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "acceptButton",
                                "text_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={acceptButton.text_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "acceptButton",
                              "text_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <TextField
                          label="Background Color"
                          value={acceptButton.background_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "acceptButton",
                                "background_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={acceptButton.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "acceptButton",
                              "background_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <TextField
                          label="Border Color"
                          value={acceptButton.border_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "acceptButton",
                                "border_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={acceptButton.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "acceptButton",
                              "border_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
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
                          customization.age,
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
                        value={rejectButton.border_radius}
                        onChange={(value) =>
                          handleSectionChange(
                            "rejectButton",
                            "border_radius",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Width"
                        value={rejectButton.border_width}
                        onChange={(value) =>
                          handleSectionChange(
                            "rejectButton",
                            "border_widtht",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <Select
                        label="Text Weight"
                        options={weightOptions}
                        value={rejectButton.text_weight}
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
                        value={rejectButton.fonts}
                        onChange={(value) =>
                          handleSectionChange("rejectButton", "fonts", value)
                        }
                      ></Select>
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Text Size"
                        value={rejectButton.text_size}
                        onChange={(value) =>
                          handleSectionChange(
                            "rejectButton",
                            "text_size",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <TextField
                          label="Text Color"
                          value={rejectButton.text_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "rejectButton",
                                "text_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={rejectButton.text_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "rejectButton",
                              "text_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <TextField
                          label="Background Color"
                          value={rejectButton.background_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "rejectButton",
                                "background_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={rejectButton.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "rejectButton",
                              "background_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <TextField
                          label="Border Color"
                          value={rejectButton.border_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "rejectButton",
                                "border_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={rejectButton.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "rejectButton",
                              "border_color",
                              e.target.value,
                            )
                          }
                          style={{
                            width: 50,
                            height: 30,
                            border: "none",
                            background: "transparent",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" mt-2">
                    <TextField
                      label="Redirect Url"
                      value={rejectButton.redirect_url}
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
                        value={popUp.height}
                        onChange={(value) =>
                          handleSectionChange("popUp", "height", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Width"
                        value={popUp.width}
                        onChange={(value) =>
                          handleSectionChange("popUp", "width", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        label="Border Radius"
                        value={popUp.border_readius}
                        onChange={(value) =>
                          handleSectionChange("popUp", "border_readius", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 mt-2">
                    <div className="flex-1">
                      <TextField
                        // label="Border Width"
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                            Border Width
                          </span>
                        }
                        value={popUp.border_width}
                        onChange={(value) =>
                          handleSectionChange("popUp", "border_width", value)
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        // label="Top And Bottom Padding"
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px] ">
                            Top And Bottom Padding
                          </span>
                        }
                        value={popUp.top_bottom_padding}
                        onChange={(value) =>
                          handleSectionChange(
                            "popUp",
                            "top_bottom_padding",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>

                    <div className="flex-1">
                      <TextField
                        // label="Left And Right Padding"
                        label={
                          <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                            Left And Right Padding
                          </span>
                        }
                        value={popUp.left_right_padding}
                        onChange={(value) =>
                          handleSectionChange(
                            "popUp",
                            "left_right_padding",
                            value,
                          )
                        }
                        placeholder="e.g., 26"
                        suffix="Px"
                      />
                    </div>
                  </div>
                </Box>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Box padding="4">
                  <Text variant="headingMd">Popup Background</Text>

                  <div className="flex gap-2 mt-2 items-start">
                    {/* Background Color */}
                    <div className="flex flex-col ">
                      <div className="flex items-center gap-1">
                        <TextField
                          label={
                            <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                              Background Color
                            </span>
                          }
                          value={popUpBackground.background_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "popUpBackground",
                                "background_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={popUpBackground.background_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "popUpBackground",
                              "background_color",
                              e.target.value,
                            )
                          }
                          className="w-[36px] h-[36px] mt-[40px] sm:mt-[20px] lg:mt-[40px] border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    {/* Border Color */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <TextField
                          label={
                            <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                              Border Color
                            </span>
                          }
                          value={popUpBackground.border_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "popUpBackground",
                                "border_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={popUpBackground.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "popUpBackground",
                              "border_color",
                              e.target.value,
                            )
                          }
                          className="w-[36px] h-[36px] mt-[40px] sm:mt-[20px] lg:mt-[40px] border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    {/* Background Layer Opacity */}
                    <TextField
                      label={
                        <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                          Background Layer Opacity
                        </span>
                      }
                      value={popUpBackground.background_opacity}
                      onChange={(value) =>
                        handleSectionChange(
                          "popUpBackground",
                          "background_opacity",
                          value,
                        )
                      }
                      suffix="Px"
                    />
                  </div>

                  <div>
                    <div className="w-[200px] mt-3">
                      <Checkbox
                        label="Enable Background Image"
                        checked={popUpBackground.image_enabale}
                        onChange={(value) =>
                          handleSectionChange(
                            "popUpBackground",
                            "image_enabale",
                            !popUpBackground.image_enabale,
                          )
                        }
                      />
                    </div>
                    {popUpBackground.image_enabale && (
                      <Box marginx="auto">
                        <DropZone
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
                            {popUpBackground.image ? (
                              <>
                                <Thumbnail
                                  source={popUpBackground.image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPopUpBackground((prev) => ({
                                      ...prev,
                                      image: null,
                                      imageFile: null,
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
                    <div className="flex-1">
                      <div className="flex gap-1">
                        <TextField
                          label={
                            <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                              Border Color
                            </span>
                          }
                          value={popUpBackground.border_color}
                          onChange={(value) => {
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              handleSectionChange(
                                "popUpBackground",
                                "border_color",
                                value,
                              );
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={popUpBackground.border_color}
                          onChange={(e) =>
                            handleSectionChange(
                              "popUpBackground",
                              "border_color",
                              e.target.value,
                            )
                          }
                          className="w-[36px] h-[36px] mt-[40px] sm:mt-[20px] lg:mt-[40px] border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex-1">
                        <TextField
                          // label="Background Layer Opacity"
                          label={
                            <span className="block min-h-[40px] sm:min-h-[0px] lg:min-h-[40px]">
                              Background Layer Opacity
                            </span>
                          }
                          value={outerPopUpBackground.outer_opacity}
                          onChange={(value) =>
                            handleSectionChange(
                              "outerPopUpBackground",
                              "outer_opacity",
                              value,
                            )
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>

                  <div>
                    <div className="mt-3">
                      <Checkbox
                        label="Enable Outer Background Image"
                        checked={outerPopUpBackground.image_enabale}
                        onChange={(value) =>
                          handleSectionChange(
                            "outerPopUpBackground",
                            "image_enabale",
                            !outerPopUpBackground.image_enabale,
                          )
                        }
                      />
                    </div>
                    {outerPopUpBackground.image_enabale && (
                      <Box marginx="auto">
                        <DropZone
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
                            {outerPopUpBackground.image ? (
                              <>
                                <Thumbnail
                                  source={outerPopUpBackground.image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOuterPopUpBackground((prev) => ({
                                      ...prev,
                                      image: null,
                                      imageFile: null,
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
                    checked={popUpLogo.show_logo}
                    onChange={(value) =>
                      handleSectionChange(
                        "popUpLogo",
                        "show_logo",
                        !popUpLogo.show_logo,
                      )
                    }
                  />
                  <Checkbox
                    label="Logo Square"
                    checked={popUpLogo.logo_square}
                    onChange={(value) =>
                      handleSectionChange(
                        "popUpLogo",
                        "logo_square",
                        !popUpLogo.logo_square,
                      )
                    }
                  />
                </div>
                {popUpLogo.show_logo && (
                  <Box marginx="auto">
                    <DropZone
                      accept="image/*"
                      onDrop={(acceptedFiles) =>
                        handleDropZoneDrop(acceptedFiles, "popUpLogo", "image")
                      }
                      allowMultiple={false}
                      type="file"
                      openFileDialogOnClick={false} // disables default click behavior
                    >
                      {({ openFileDialog }) => (
                        <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                          {popUpLogo.image ? (
                            <>
                              <div
                                className={
                                  popUpLogo.logo_square
                                    ? "rounded-none overflow-hidden"
                                    : "rounded-full overflow-hidden"
                                }
                              >
                                <Thumbnail
                                  source={popUpLogo.image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setPopUpLogo((prev) => ({
                                    ...prev,
                                    image: null,
                                    imageFile: null,
                                  }));
                                }}
                                className="absolute top-0 right-0 bg-white hover:bg-red-100 text-red-600 rounded-full p-1 shadow"
                                title="Remove image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={openFileDialog}
                              className="text-subdued text-sm"
                            >
                              Upload an image
                            </button>
                          )}
                        </div>
                      )}
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
                    checked={displayCriteria.page === "all-pages"}
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
                    checked={displayCriteria.page === "specific-pages"}
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

                  {displayCriteria.page === "specific-pages" && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        // console.log("coint : ", displayCriteria + 1),

                        handleSectionChange(
                          "displayCriteria",
                          "count",
                          displayCriteria.count + 1,
                        )
                      }
                    >
                      Add URL
                    </Button>
                  )}
                </div>

                {displayCriteria.page === "specific-pages" && (
                  <div className="mt-2">
                    <Text variant="bodyMd" as="p">
                      Enter URL
                    </Text>
                    <div className="mt-2 w-9/10">
                      <TextField
                        label=""
                        value={displayCriteria.url?.[0] || ""}
                        onChange={(value) => {
                          const newUrls = [...displayCriteria.url];
                          newUrls[0] = value;
                          handleSectionChange(
                            "displayCriteria",
                            "url",
                            newUrls,
                          );
                        }}
                        autoComplete="off"
                      />
                      {!displayCriteria.url?.[0] && (
                        <div className="flex items-center gap-2 text-red-600 mt-1 w-full">
                          <AlertCircle size={18} />
                          <span className="truncate">
                            Please add a valid URL for the specific page.
                          </span>
                        </div>
                      )}
                    </div>
                    {Array.from({ length: displayCriteria.count }).map(
                      (_, index) => (
                        <div className="mt-2 w-9/10">
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-grow">
                              <TextField
                                label=""
                                value={displayCriteria.url[index + 1] || ""}
                                onChange={(value) => {
                                  const newUrls = [...displayCriteria.url];
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
                              className="cursor-pointer text-red-600 hover:text-red-700"
                              onClick={() => {
                                console.log("index : ", index + 1);

                                const newUrls = displayCriteria.url.filter(
                                  (_, i) => i !== index + 1,
                                );
                                console.log("newUrls : ", newUrls);
                                handleSectionChange(
                                  "displayCriteria",
                                  "count",
                                  displayCriteria.count - 1,
                                );
                                handleSectionChange(
                                  "displayCriteria",
                                  "url",
                                  newUrls,
                                );
                              }}
                            />
                          </div>
                          {!displayCriteria.url[index + 1] && (
                            <div className="flex items-center gap-2 text-red-600 mt-1 w-full">
                              <AlertCircle size={18} />
                              <span className="truncate">
                                Please add a valid URL for the specific page.
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
                  checked={policy.checked}
                  onChange={() =>
                    handleSectionChange("policy", "checked", !policy.checked)
                  }
                />
                {policy.checked && (
                  <Box maxWidth="400px" marginx="auto">
                    <div className="flex h-[210px] mt-4">
                      {/* Only render ReactQuill if loaded on client */}
                      {ReactQuill ? (
                        <ReactQuill
                          theme="snow"
                          checked={policy.text}
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
                    checked={monthlyAnalysis}
                    onChange={() =>
                      handleSectionChange(
                        "monthlyAnalysis",
                        null,
                        !monthlyAnalysis,
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
                    value={advanced.css}
                    onChange={(value) =>
                      handleSectionChange("advanced", "css", value)
                    }
                    multiline={4}
                    autoComplete="off"
                  />
                </Box>

                <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                <Box padding="4">
                  <TextField
                    label="Custom script (Use this option to do a custom script where Age Verification doing anything)"
                    value={advanced.script}
                    onChange={(value) =>
                      handleSectionChange("advanced", "script", value)
                    }
                    multiline={4}
                    autoComplete="off"
                  />
                </Box>
              </Card>
            </Box>
          </div>

          {/* Right Section */}
          <div
            className="flex flex-col w-full mb-5 sm:mt-0 sm:mb-0 sm:w-[62%] sm:h-screen sm:fixed sm:right-0 sm:top-0 sm:p-1 overflow-y-auto scrollbar-hide"
            // style={{ overflowY: "auto" }}
          >
            <ui-save-bar id="my-save-bar">
              <button variant="primary" id="save-button">
                Save
              </button>
              <button id="discard-button">Discard</button>
            </ui-save-bar>

            <div className="mt-5 mb-10 right-4 flex justify-end space-x-4">
              <Button
                variant="primary"
                onClick={() => {
                  console.log("Saving...");
                  addSetting();
                  document.getElementById("save-button").click();
                }}
              >
                Save
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  console.log("Discarding...");
                  removeSetting();
                  document.getElementById("discard-button").click();
                }}
              >
                Discard
              </Button>
            </div>
            <div className="px-4 pb-8">
              {customization.layout === "template1" ? (
                <Template1 data={data} />
              ) : customization.layout === "template2" ? (
                <Template2 data={data} />
              ) : customization.layout === "template3" ? (
                <Template3 data={data} />
              ) : customization.layout === "template4" ? (
                <Template4 data={data} />
              ) : customization.layout === "template5" ? (
                <Template5 data={data} />
              ) : null}
            </div>
          </div>
        </div>
      </Page>
    </AppProvider>
  );
}