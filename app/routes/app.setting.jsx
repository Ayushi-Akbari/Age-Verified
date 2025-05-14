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
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import VerificationCard from "./app.verificationCard";

import { authenticate } from "../shopify.server";
// import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// import { redirect } from "@remix-run/node";
import axios from 'axios';

// import {loader} from "./settingServer"

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
      // navigate(`/auth?shop=${shopParam}`);
      throw new Response("Shop parameter missing", { status: 400 });
    } else {
      throw new Response("Shop parameter missing", { status: 400 });
    }
  }
}

export default function SettingsPolaris() {
  // const navigate = useNavigate();
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

  const { shop } = useLoaderData(); 

  const [descriptionText, setDescriptionText] = useState("Please verify that you are {{minimum_age}} years of age or older to enter this site.",);
  const [acceptButtonText, setAcceptButtonText] = useState("Yes, I’m over {{minimum_age}}");
  const [rejectButtonText, setRejectButtonText] = useState("No, I’m under {{minimum_age}}");

  // const [shops, setShops] = useState(shop);

  useEffect(() => {
    console.log("hello");
    
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
      
      // Set state values if present
      setAge(parsedSetting.age || "");
      
      if (parsedSetting.image) {
        const path = parsedSetting.image;
        // const relativePath = parsedSetting.image.replace(/\\/g, "/").split("age-verification/")[1];
        // console.log("app : " + relativePath);
        console.log("image : " , image);
        
        setImage(`http://localhost:8001${path}`)
        console.log("image : " , image);
        console.log("path:", path);
      }
      
      parsedSetting.title && setTitle(parsedSetting.title);
      parsedSetting.description && setDescription(parsedSetting.description);
      parsedSetting.acceptButton && setAcceptButton(parsedSetting.acceptButton);
      parsedSetting.rejectButton && setRejectButton(parsedSetting.rejectButton);

      console.log("title : :  " ,title);
      console.log("description : :  " ,description);
      console.log("acceptButton : " ,acceptButton);
      console.log("rejectButton : " ,rejectButton);
      
    }

  };

  const addSetting = async () => {

    if( !shop || !shop.name){
      // navigate(
      //   `/auth?shop=${new URL(request.url).searchParams.get("shop")}`,
      // );
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
            <div className="w-[35%] p-4 space-y-8 overflow-y-scroll scrollbar-hide">
              <Text variant="headingXl" as="h1">
                Settings
              </Text>
              <Box paddingBlockStart="8">
                <Text Text variant="headingMd" as="h3">
                  Customizations
                </Text>
                <Card>
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
                          handleSectionChange('title','text',value)
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
                            handleSectionChange('title','fonts',value)
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Select
                          label="Text Weight"
                          options={weightOptions}
                          value={title.text_weight}
                          onChange={(value) => {
                            handleSectionChange('title','text_weight',value)
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <TextField
                          label="Text Size"
                          value={title.text_size}
                          onChange={(value) =>
                            handleSectionChange('title','text_size',value)
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
                                handleSectionChange('title','text_color',value)
                              }
                            }}
                          />
                          <input
                            type="color"
                            value={title.text_color}
                            onChange={(e) =>
                              handleSectionChange('title','text_color',e.target.value)
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
                  Image
                </Text>
                <Card>
                  <Box maxWidth="400px" marginX="auto">
                    <DropZone
                      accept="image/*"
                      onDrop={handleDropZoneDrop}
                      allowMultiple={false}
                    >
                      <div className="p-[10px] flex justify-center items-center h-[100px]">
                        {image ? (
                          <Thumbnail
                            source={image}
                            alt="Uploaded image preview"
                            size="large"
                          />
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
            <div className="flex flex-col w-[65%] h-screen fixed right-0 top-0 p-4">
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