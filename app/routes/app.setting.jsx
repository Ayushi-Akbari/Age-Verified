import { useState, useEffect } from "react";
import { Card } from "@shopify/polaris";
import VerificationCard from "./app.verificationCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerificationPage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [age, setAge] = useState(18);
  const [title, setTitle] = useState({
    text: "Welcome!",
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 26,
    text_color: "#000000",
  });

  const [description, setDescription] = useState({
    text: `Please verify that you are ${age} years of age or older to enter this site.`,
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 14,
    text_color: "#000000",
  });

  const [descriptionText, setDescriptionText] = useState("Please verify that you are {{minimum_age}} years of age or older to enter this site.")

  const [acceptButton, setAcceptButton] = useState({
    text: `Yes, I’m over ${age}`,
    border_radius: 5,
    border_width: 1,
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 16,
    text_color: "#000000",
    background_color: "#ffffff",
    border_color: "#c8c8c8"
  });

  const [acceptButtonText, setAcceptButtonText] = useState("Yes, I’m over {{minimum_age}}")

  const [rejectButton, setRejectButton] = useState({
    text: `No, I’m under ${age}`,
    border_radius: 5,
    border_width: 1,
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 16,
    text_color: "#000000",
    background_color: "#ffffff",
    border_color: "#c8c8c8",
    redirect_url: "https://google.com/",
  });

  const [rejectButtonText, setRejectButtonText] = useState("No, I’m under {{minimum_age}}")


  let isCancelled = false;

  useEffect(() => {
    // if (!isCancelled) {
      fetchData();
    // }
    
    return () => {
      isCancelled = true;
    };
  }, []);

  const fetchData = async () => {
    const data = await axios.get(`http://localhost:8001/user/get-setting`)
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
        const relativePath = parsedSetting.image.replace(/\\/g, "/").split("age-verification/")[1];
        console.log("app : " + relativePath);
// setImage("http://localhost:8001/")

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const addSetting = async () => {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput?.files?.[0];
    const formData = new FormData();
 
    formData.append("age", age);
    formData.append("image", file)
    formData.append("title", JSON.stringify(title));
    formData.append("description", JSON.stringify(description));
    formData.append("acceptButton", JSON.stringify(acceptButton));
    formData.append("rejectButton", JSON.stringify(rejectButton));

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
        
    const response = await axios.post(
      `http://localhost:8001/user/add-setting`,
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
    <div className="flex flex-col ml-6">
      <div className="w-[35%] overflow-y-scroll h-full ml-6 pr-2 scrollbar-hide">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 justify-start mt-10 mb-8">
            Settings
          </h1>
          <div className="text-m text-gray-800 mb-2">Customizations</div>
          <Card>
            <div className="text-sm text-gray-800 mt-1 mb-5">
              Verifications Settings
            </div>

            <div className="text-[13px] text-gray-600 mb-1">Age</div>

            <div className="flex items-center border border-gray-500 rounded-md px-3 py-2 w-[50%]">
              <input
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  
                  setRejectButton((prev) => ({
                    ...prev,
                    text: prev.text.replace(age, e.target.value), 
                  }));
                  
                  setAcceptButton((prev) => ({
                    ...prev,
                    text: prev.text.replace(age, e.target.value), 
                  }));
                  
                  setDescription((prev) => ({
                    ...prev,
                    text: prev.text.replace(age, e.target.value), 
                  }));
                }}
                className="w-full outline-none text-sm"
              />
              <span className="ml-2 text-gray-600 text-sm">Year(s)</span>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <div className="text-m text-gray-800 mb-2">Text Customizations</div>
          <Card>
            <div className="text-sm text-gray-800 mt-1 mb-3">Title</div>
            <div className="flex gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text</div>
                <input
                  type="text"
                  name="text"
                  placeholder="Enter text"
                  value={title.text}
                  onChange={(e) =>
                    setTitle({ ...title, [e.target.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Text Weight
                </div>
                <select
                  name="text_weight"
                  value={title.text_weight}
                  onChange={(e) =>
                    setTitle({ ...title, [e.target.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-thin">Thin</option>
                  <option value="font-extralight">Extra Light</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semi Bold</option>
                  <option value="font-bold">Bold</option>
                  <option value="font-extrabold">Extra Bold</option>
                  <option value="font-black">Black</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Fonts</div>
                <select
                  name="fonts"
                  value={title.fonts}
                  onChange={(e) =>
                    setTitle({ ...title, [e.target.name]: e.target.value })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-sans">Sans</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                  <option value="font-inter">Inter</option>
                  <option value="font-poppins">Poppins</option>
                  <option value="font-roboto">Roboto</option>
                </select>
              </div>
            </div>
            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Size</div>
                <input
                  type="text"
                  placeholder="Enter text"
                  name="text_size"
                  value={title.text_size}
                  onChange={(e) =>
                    setTitle({ ...title, [e.target.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col mr-3 w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="text_color"
                    value={title.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setTitle({
                          ...title,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={title.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setTitle({
                          ...title,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-7 mx-0 border-gray-300" />

            <div className="text-sm text-gray-800 mt-1 mb-5">Description</div>
            <div>
              <div className="text-[13px] text-gray-600 mb-1">Text</div>
              <input
                type="text"
                placeholder="Enter text"
                name="text"
                value={descriptionText}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription({
                    ...description,
                    [e.target.name]: value.replace("{{minimum_age}}", age),
                  });
                  setDescriptionText(value);
                }}
                className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-400 mt-1">
                Note: Please use {"{{minimum_age}}"} for the liquid variable to
                specify the age in the popup message.
              </div>
            </div>
            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Text Weight
                </div>
                <select
                  name="text_weight"
                  value={title.text_weight}
                  onChange={(e) =>
                    setDescription({
                      ...description,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-thin">Thin</option>
                  <option value="font-extralight">Extra Light</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semi Bold</option>
                  <option value="font-bold">Bold</option>
                  <option value="font-extrabold">Extra Bold</option>
                  <option value="font-black">Black</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Fonts</div>
                <select
                  name="fonts"
                  value={description.fonts}
                  onChange={(e) =>
                    setDescription({
                      ...description,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-sans">Sans</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                  <option value="font-inter">Inter</option>
                  <option value="font-poppins">Poppins</option>
                  <option value="font-roboto">Roboto</option>
                </select>
              </div>

              <div className="flex flex-col mr-2 w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Size</div>
                <input
                  type="text"
                  placeholder="Enter text"
                  name="text_size"
                  value={description.text_size}
                  onChange={(e) =>
                    setDescription({
                      ...description,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex mt-3 gap-3">
              <div className="flex flex-col mr-3 w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="text_color"
                    value={description.text_color}
                    onChange={(e) =>
                      setDescription({
                        ...description,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={description.text_color}
                    onChange={(e) =>
                      setDescription({
                        ...description,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 mb-5">
          <div className="text-m text-gray-800 mb-2">Button Settings</div>
          <Card>
            <div className="text-sm text-gray-800 mt-1 mb-3">Accept Button</div>
            <div className="flex gap-3 ">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text</div>
                <input
                  type="text"
                  placeholder="Enter text"
                  name="text"
                  value={acceptButtonText}
                  onChange={(e) =>{
                    const value = e.target.value;
                    setAcceptButton({
                      ...acceptButton,
                      [e.target.name]: value.replace("{{minimum_age}}", age),
                    });
                    setAcceptButtonText(value)
                  }}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Radius
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="border_radius"
                    value={acceptButton.border_radius}
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Width
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="border_width"
                    value={acceptButton.border_width}
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>
            </div>

            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Text Weight
                </div>
                <select
                  name="text_weight"
                  value={acceptButton.text_weight}
                  onChange={(e) =>
                    setAcceptButton({
                      ...acceptButton,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-thin">Thin</option>
                  <option value="font-extralight">Extra Light</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semi Bold</option>
                  <option value="font-bold">Bold</option>
                  <option value="font-extrabold">Extra Bold</option>
                  <option value="font-black">Black</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Fonts</div>
                <select
                  name="fonts"
                  value={acceptButton.fonts}
                  onChange={(e) =>
                    setAcceptButton({
                      ...acceptButton,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-sans">Sans</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                  <option value="font-inter">Inter</option>
                  <option value="font-poppins">Poppins</option>
                  <option value="font-roboto">Roboto</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Size</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="text_size"
                    value={acceptButton.text_size}
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>
            </div>

            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="text_color"
                    value={acceptButton.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={acceptButton.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Background Color
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="background_color"
                    value={acceptButton.background_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="background_color"
                    value={acceptButton.background_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Border Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="border_color"
                    value={acceptButton.border_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="border_color"
                    value={acceptButton.border_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setAcceptButton({
                          ...acceptButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-7 mx-0 border-gray-300" />

            <div className="text-sm text-gray-800 mt-4 mb-3">Reject Button</div>
            <div className="flex gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text</div>
                <input
                  type="text"
                  placeholder="Enter text"
                  name="text"
                  value={rejectButtonText}
                  onChange={(e) =>{
                    const value = e.target.value;
                    setRejectButton({
                      ...rejectButton,
                      [e.target.name]: value.replace("{{minimum_age}}", age),
                    });
                    setAcceptButtonText(value)
                  }}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Radius
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="border_radius"
                    value={rejectButton.border_radius}
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Width
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="border_width"
                    value={rejectButton.border_width}
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>
            </div>

            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Text Weight
                </div>
                <select
                  name="text_weight"
                  value={rejectButton.text_weight}
                  onChange={(e) =>
                    setRejectButton({
                      ...rejectButton,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-thin">Thin</option>
                  <option value="font-extralight">Extra Light</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semi Bold</option>
                  <option value="font-bold">Bold</option>
                  <option value="font-extrabold">Extra Bold</option>
                  <option value="font-black">Black</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Fonts</div>
                <select
                  name="fonts"
                  value={rejectButton.fonts}
                  onChange={(e) =>
                    setRejectButton({
                      ...rejectButton,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-[8px] border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-sans">Sans</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                  <option value="font-inter">Inter</option>
                  <option value="font-poppins">Poppins</option>
                  <option value="font-roboto">Roboto</option>
                </select>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Size</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    name="text_size"
                    value={rejectButton.text_size}
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                  />
                  <span className="ml-2 text-gray-400 text-sm">Px</span>
                </div>
              </div>
            </div>

            <div className="flex mt-3 gap-3">
              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="text_color"
                    value={rejectButton.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={rejectButton.text_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">
                  Background Color
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="background_color"
                    value={rejectButton.background_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="background_color"
                    value={rejectButton.background_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Border Color</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-[6px]">
                  <input
                    type="text"
                    name="border_color"
                    value={rejectButton.border_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="border_color"
                    value={rejectButton.border_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        setRejectButton({
                          ...rejectButton,
                          [e.target.name]: val,
                        });
                      }
                    }}
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[13px] text-gray-600 mt-3 mb-1">
                Redirect URL
              </div>
              <input
                type="text"
                placeholder="Enter text"
                name="redirect_url"
                value={rejectButton.redirect_url}
                onChange={(e) =>
                  setRejectButton({
                    ...rejectButton,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>
        </div>

        <div className="mb-8">
  <div className="text-m text-gray-800 mb-2">Image</div>
  <Card>
    <div className="w-full max-w-md mx-auto">
      <div className="w-full h-48 bg-gray-200 border border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 relative overflow-hidden">
        {image && (
          <img
            src={image}
            alt="Preview"
            className="absolute w-[200px] h-[200px] object-cover rounded-lg left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <label
          htmlFor="imageUpload"
          className="z-10 text-gray-700 text-sm px-4 py-2 bg-white border border-gray-300 rounded shadow"
        >
          Upload File
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  </Card>
</div>
      </div>
      <div className="flex flex-col w-[65%] h-screen fixed right-0 top-0 p-4">
        <div className="self-end">
        <button
          className="text-md font-bold text-white bg-slate-800 px-6 py-2 rounded-lg mt-4 mb-8 mr-3 active:scale-95"
          onClick={addSetting}
        >
          Save
        </button>
        <button
          className="text-md font-bold text-white bg-slate-800 px-6 py-2 rounded-lg mt-4 mb-8 active:scale-95"
          onClick={removeSetting}
        >
          Discard
        </button>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <Card>
            <div className="bg-gray-400 p-10">
              <div className="bg-yellow-100 rounded-2xl shadow-2xl border-4 border-white sm:h-[300px] h-[400px] xs:w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[500px] p-4 flex flex-col sm:flex-row relative">
                <div className="sm:w-2/5 w-full flex justify-center items-center p-4">
                  <img
                    src={image}
                    alt="Popup Image"
                    width={300}
                    height={300}
                    className="object-contain rounded-lg w-full max-w-[300px]"
                  />
                </div>

                <div className="sm:w-3/5 w-full flex flex-col justify-center p-4 text-center sm:text-left">
                  <h1
                    className={`${title.text_weight} ${title.fonts} mb-4`}
                    style={{
                      fontSize: `${title.text_size}px`,
                      color: title.text_color,
                    }}
                  >
                    {title.text}
                  </h1>
                  <p
                    className={`${description.text_weight} ${description.fonts} mb-6`}
                    style={{
                      fontSize: `${description.text_size}px`,
                      color: description.text_color,
                    }}
                  >
                    {description.text}
                  </p>
                  <div className="flex flex-col space-y-3">
                    <button
                      // onClick={handleNo}
                      className={`border ${rejectButton.fonts} ${rejectButton.text_weight} py-2 rounded-lg active:scale-95`}
                      style={{
                        fontSize: `${rejectButton.text_size}px`,
                        color: rejectButton.text_color,
                        backgroundColor: rejectButton.background_color,
                        borderWidth: `${rejectButton.border_width}px`,
                        borderColor: rejectButton.border_color,
                        borderRadius: `${rejectButton.border_radius}px`,
                      }}
                    >
                      {rejectButton.text}
                    </button>
                    <button
                      // onClick={handleYes}
                      className={`${acceptButton.fonts} ${acceptButton.text_weight} py-2 rounded-lg active:scale-95`}
                      style={{
                        fontSize: `${acceptButton.text_size}px`,
                        color: acceptButton.text_color,
                        backgroundColor: acceptButton.background_color,
                        borderWidth: `${acceptButton.border_width}px`,
                        borderColor: acceptButton.border_color,
                        borderRadius: `${acceptButton.border_radius}px`,
                      }}
                    >
                      {acceptButton.text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
