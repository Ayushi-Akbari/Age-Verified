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
  Checkbox
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";
import VerificationCard from "./app.verificationCard";
import { Trash2, Info } from "lucide-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import axios from 'axios';

export async function loader({ request }) {
  // const navigate = useNavigate();
  const shopParam = new URL(request.url).searchParams.get("shop");

  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
      query {
        shop {
          name
          contactEmail
          createdAt
          currencyCode
        }
      }
    `);

    const data = await response.json();
    if(!data){
      return null
    }
    const shop = data.data.shop;
    return {shop};
  } catch (error) {
    console.error("Auth failed:", error);
    if (shopParam) {
      // throw redirect(`/auth?shop=${shopParam}`);
      // throw new Response("Shop parameter missing", { status: 400 });
      return null
    } else {
      // throw new Response("Shop parameter missing", { status: 400 });
      return null
    }
  }
}

export default function Setting() {
  const [age, setAge] = useState("18");
  const [hasChanges, setHasChanges] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null)
  const [title, setTitle] = useState({
    text: "Welcome!",
    text_weight: "bold",
    fonts: "sans-serif",
    text_size: 20,
    text_color: "#505050",
  });
  const [description, setDescription] = useState({
    text: `Please verify that you are ${age} years of age or older to enter this site.`,
    text_weight: "normal",
    fonts: "sans-serif",
    text_size: 12,
    text_color: "#505050",
  });
  const [rejectButton, setRejectButton] = useState({
    text: `No, I’m under ${age}`,
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
    text: `Yes, I’m over ${age}`,
    fonts: "sans-serif",
    text_weight: "100",
    text_size: 14,
    text_color: "#000000",
    background_color: "#ffffff",
    border_color: "#cccccc",
    border_width: 1,
    border_radius: 6,
  });
  const [selectedLayout, setSelectedLayout]= useState(null)
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const { shop } = useLoaderData(); 

  const [descriptionText, setDescriptionText] = useState("Please verify that you are {{minimum_age}} years of age or older to enter this site.",);
  const [acceptButtonText, setAcceptButtonText] = useState("Yes, I’m over {{minimum_age}}");
  const [rejectButtonText, setRejectButtonText] = useState("No, I’m under {{minimum_age}}");

  

  useEffect(async() => {    
    console.log("hello");

    const id_token_new = await shopify.idToken();

    console.log("id_token_new : " , id_token_new);
    
    
    console.log("Loaded shop data: ", shop);
    let isCancelled = false

    if (!isCancelled) {
      fetchData();
    }
    
    return () => {
      isCancelled = true;
    };
  }, [shop]);


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

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    console.log("upload file : ", uploadedFile);
    
    setImageFile(acceptedFiles[0])

    console.log("image file : ", imageFile);
    
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(uploadedFile);
  }, []);
  

  const handleSectionChange = (section, key, value) => {
    if (section === 'title') {
      setTitle(prev => ({ ...prev, [key]: value }));
    } else if (section === 'description') {
      setDescription(prev => ({ ...prev, [key]: value }));
    } else if (section === 'acceptButton') {
      setAcceptButton(prev => ({ ...prev, [key]: value }));
    } else if (section === 'rejectButton') {
      setRejectButton(prev => ({ ...prev, [key]: value }));
    }
    setHasChanges(true);
  };

  const fetchData = async () => {
    const data = await axios.get(`http://localhost:8001/user/get-setting?name=${shop.name}`)
    if(data){
      const settingData = data.data.data.settings
      const parsedSetting = {
        ...settingData,
        title: settingData.title ? JSON.parse(settingData.title) : null,
        description: settingData.description ? JSON.parse(settingData.description) : null,
        acceptButton: settingData.acceptButton ? JSON.parse(settingData.acceptButton) : null,
        rejectButton: settingData.rejectButton ? JSON.parse(settingData.rejectButton) : null,
      };
      
      setAge(parsedSetting.age || "18");
      
      if (parsedSetting.image) {
        const path = parsedSetting.image; 
        setImage(`http://localhost:8001${path}`)
      }
      
      parsedSetting.title && setTitle(parsedSetting.title);
      parsedSetting.description && setDescription(parsedSetting.description);
      parsedSetting.acceptButton && setAcceptButton(parsedSetting.acceptButton);
      parsedSetting.rejectButton && setRejectButton(parsedSetting.rejectButton);
    }

  };

  const addSetting = async () => {

    if( !shop || !shop.name){
      console.log("login first");
      return null;
    }

    console.log("file : ", imageFile);
    
    const formData = new FormData();
 
    formData.append("age", age);
    formData.append("image", imageFile)
    formData.append("title", JSON.stringify(title));
    formData.append("description", JSON.stringify(description));
    formData.append("acceptButton", JSON.stringify(acceptButton));
    formData.append("rejectButton", JSON.stringify(rejectButton));

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
        
    const response = await axios.post(
      `http://localhost:8001/user/add-setting?name=${shop.name}`,
      formData,
    );

    console.log("response : ", response.status);
    if(response.status === 200){
      fetchData()
    }

    
  };

  const removeSetting = async () =>{
    window.location.reload();
  }

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <div className="flex w-full h-full mx-0">
            {/* Left Section */}
            <div className="w-[36%] p-2 space-y-8 overflow-y-scroll scrollbar-hide">
              <Text variant="headingXl" as="h1">
                Settings
              </Text>
              <Box paddingBlockStart="8">
                <Text Text variant="headingMd" as="h3">
                  Customizations
                </Text>
                <Card>
                  <Text variant="semibold">Pop-up Layouts</Text>
                  <div className="mt-2 ">
                    <ChoiceList
                      // title="Pop-up Layouts"
                      choices={[
                        { label: "Layout 1", value: "layout1" },
                        { label: "Layout 2", value: "layout2" },
                      ]}
                      selected={[selectedLayout]}
                      onChange={(value) => setSelectedLayout(value[0])}
                    />
                  </div>

                  <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                  <Text variant="semibold">Verification Settings</Text>
                  <div className="w-[200px] mt-2">
                    <TextField
                      label="Age"
                      type="number"
                      value={age}
                      onChange={(value) => {
                        {
                          setAge(value);

                          setRejectButton((prev) => ({
                            ...prev,
                            text: prev.text.replace(age, value),
                          }));

                          setAcceptButton((prev) => ({
                            ...prev,
                            text: prev.text.replace(age, value),
                          }));

                          setDescription((prev) => ({
                            ...prev,
                            text: prev.text.replace(age, value),
                          }));
                        }
                      }}
                      suffix="Year(s)"
                    />
                  </div>

                  <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                  <Text variant="semibold">Pop-up Show Settings</Text>
                  <div className="w-[200px] mt-2">
                    <Checkbox
                      label="Pop-up show every time"
                      checked={checked}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex border rounded-md bg-blue-100  p-2 gap-2 items-start">
                    <div className="w-8 h-4 rounded-md border-blue-100 flex items-center justify-center">
                      <Info size={16} className="text-blue-700" />
                    </div>
                    <span className="text-xm text-blue-950">
                      The pop-up will appear in every new session for both new
                      and existing users. In a single session, if the user
                      clicks the 'Agree' button, the pop-up will not appear
                      again during that session, as it has already been
                      accepted.
                      <br />
                    </span>
                  </div>
                </Card>
              </Box>

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
                                handleSectionChange(
                                  "title",
                                  "text_color",
                                  value,
                                );
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
                          setDescription({
                            ...description,
                            text: value.replace("{{minimum_age}}", age),
                          });
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
                            setDescription({ ...description, fonts: value })
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Select
                          label="Text Weight"
                          options={weightOptions}
                          value={description.text_weight}
                          onChange={(value) =>
                            setDescription({
                              ...description,
                              text_weight: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <TextField
                          label="Text Size"
                          value={description.text_size}
                          onChange={(value) =>
                            setDescription({ ...description, text_size: value })
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
                                setDescription({
                                  ...description,
                                  text_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={description.text_color}
                            onChange={(e) =>
                              setDescription({
                                ...description,
                                text_color: e.target.value,
                              })
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
                          console.log("value : ", value);

                          setAcceptButton({
                            ...acceptButton,
                            text: value.replace("{{minimum_age}}", age),
                          });

                          console.log("accept button : ", acceptButton);

                          setAcceptButtonText(value);

                          console.log("button text : ");
                        }}
                      />
                    </div>

                    <div className="flex gap-3 mb-4 mt-2">
                      <div className="flex-1">
                        <TextField
                          label="Border Radius"
                          value={acceptButton.border_radius}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              border_radius: value,
                            })
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
                            setAcceptButton({
                              ...acceptButton,
                              border_width: value,
                            })
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
                            setAcceptButton({
                              ...acceptButton,
                              text_weight: value,
                            })
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
                            setAcceptButton({ ...acceptButton, fonts: value })
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Text Size"
                          value={acceptButton.text_size}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              text_size: value,
                            })
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
                                setAcceptButton({
                                  ...acceptButton,
                                  text_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={acceptButton.text_color}
                            onChange={(e) =>
                              setAcceptButton({
                                ...acceptButton,
                                text_color: e.target.value,
                              })
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
                                setAcceptButton({
                                  ...acceptButton,
                                  background_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={acceptButton.background_color}
                            onChange={(e) =>
                              setAcceptButton({
                                ...acceptButton,
                                background_color: e.target.value,
                              })
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
                                setAcceptButton({
                                  ...acceptButton,
                                  border_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={acceptButton.border_color}
                            onChange={(e) =>
                              setAcceptButton({
                                ...acceptButton,
                                border_color: e.target.value,
                              })
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
                          setRejectButton({
                            ...rejectButton,
                            text: value.replace("{{minimum_age}}", age),
                          });
                          setAcceptButtonText(value);
                        }}
                      />
                    </div>

                    <div className="flex gap-3 mb-4 mt-2">
                      <div className="flex-1">
                        <TextField
                          label="Border Radius"
                          value={rejectButton.border_radius}
                          onChange={(value) =>
                            setRejectButton({
                              ...rejectButton,
                              border_radius: value,
                            })
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
                            setRejectButton({
                              ...rejectButton,
                              border_width: value,
                            })
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
                            setRejectButton({
                              ...rejectButton,
                              text_weight: value,
                            })
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
                            setRejectButton({ ...rejectButton, fonts: value })
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Text Size"
                          value={rejectButton.text_size}
                          onChange={(value) =>
                            setRejectButton({
                              ...rejectButton,
                              text_size: value,
                            })
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
                                setRejectButton({
                                  ...rejectButton,
                                  text_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={rejectButton.text_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                text_color: e.target.value,
                              })
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
                                setRejectButton({
                                  ...rejectButton,
                                  background_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={rejectButton.background_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                background_color: e.target.value,
                              })
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
                                setRejectButton({
                                  ...rejectButton,
                                  border_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={rejectButton.border_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                border_color: e.target.value,
                              })
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
                        type="number"
                        value={rejectButton.redirect_url}
                        onChange={(value) =>
                          setRejectButton({
                            ...rejectButton,
                            redirect_url: value,
                          })
                        }
                      />
                    </div>
                  </Box>
                </Card>
              </Box>

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
                          value={acceptButton.border_radius}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              border_radius: value,
                            })
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Width"
                          value={acceptButton.border_width}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              border_width: value,
                            })
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Border Radius"
                          value={acceptButton.border_width}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              border_width: value,
                            })
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mb-4 mt-2">
                      <div className="flex-1">
                        <TextField
                          label="Border Widht"
                          value={acceptButton.text_size}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              text_size: value,
                            })
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Top And Bottom Padding"
                          value={acceptButton.text_size}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              text_size: value,
                            })
                          }
                          placeholder="e.g., 26"
                          suffix="Px"
                        />
                      </div>

                      <div className="flex-1">
                        <TextField
                          label="Left And Right Padding"
                          value={acceptButton.text_size}
                          onChange={(value) =>
                            setAcceptButton({
                              ...acceptButton,
                              text_size: value,
                            })
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

                    <div className="flex gap-3 mb-4 mt-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <TextField
                            label="Background Color"
                            value={rejectButton.background_color}
                            onChange={(value) => {
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                setRejectButton({
                                  ...rejectButton,
                                  background_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={rejectButton.background_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                background_color: e.target.value,
                              })
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
                                setRejectButton({
                                  ...rejectButton,
                                  border_color: value,
                                });
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={rejectButton.border_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                border_color: e.target.value,
                              })
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
                        <div className="flex-1">
                          <TextField
                            label="Background Layer Opacity"
                            value={acceptButton.border_width}
                            onChange={(value) =>
                              setAcceptButton({
                                ...acceptButton,
                                border_width: value,
                              })
                            }
                            placeholder="e.g., 26"
                            suffix="Px"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="w-[200px] mt-3">
                        <Checkbox
                          label="Pop-up show every time"
                          checked={checked}
                          onChange={handleChange}
                        />
                      </div>
                      <Box maxWidth="400px" marginX="auto">
                        <DropZone
                          accept="image/*"
                          onDrop={handleDropZoneDrop}
                          allowMultiple={false}
                        >
                          <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                            {image ? (
                              <>
                                <Thumbnail
                                  source={image}
                                  alt="Uploaded image preview"
                                  size="large"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImage(null);
                                    setImageFile(null); // if you're also managing raw file
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
                    </div>
                  </Box>

                  <hr className="mt-5 mx-0 border-gray-300 mb-5" />

                  <Box padding="4">
                    <Text variant="headingMd">Popup Background</Text>

                    <div className="flex gap-3 mb-4 mt-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Outer Layer Color
                        </label>
                        <div className="flex items-center border border-gray-][] rounded-lg overflow-hidden w-fit">
                          <input
                            type="text"
                            value={rejectButton.background_color}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                setRejectButton({
                                  ...rejectButton,
                                  background_color: value,
                                });
                              }
                            }}
                            className="px-2 py-1 outline-none text-sm w-[90px]"
                          />
                          <input
                            type="color"
                            value={rejectButton.background_color}
                            onChange={(e) =>
                              setRejectButton({
                                ...rejectButton,
                                background_color: e.target.value,
                              })
                            }
                            className="w-8 h-8 border-none p-0 cursor-pointer mr-1 rounded-lg"
                            
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex-1">
                          <TextField
                            label="Background Layer Opacity"
                            value={acceptButton.border_width}
                            onChange={(value) =>
                              setAcceptButton({
                                ...acceptButton,
                                border_width: value,
                              })
                            }
                            placeholder="e.g., 26"
                            suffix="Px"
                          />
                        </div>
                      </div>

                      <div className="flex-1"></div>
                    </div>
                  </Box>
                </Card>
              </Box>

              <Box paddingBlockStart="8">
                <Text variant="headingMd" as="h3">
                  Image
                </Text>
                <Card>
                  <Box maxWidth="400px" marginX="auto">
                    <DropZone
                      accept="image/*"
                      onDrop={handleDropZoneDrop}
                      allowMultiple={false}
                    >
                      <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                        {image ? (
                          <>
                            <Thumbnail
                              source={image}
                              alt="Uploaded image preview"
                              size="large"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImageFile(null); // if you're also managing raw file
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
                </Card>
              </Box>
            </div>

            {/* Right Section */}
            <div className="flex flex-col w-[62%] h-screen fixed right-0 top-0 p-4">
              <VerificationCard
                age={age}
                image={image}
                title={title}
                description={description}
                acceptButton={acceptButton}
                rejectButton={rejectButton}
                hasChanges={hasChanges}
                setHasChanges={setHasChanges}
                addSetting={addSetting}
              />
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}