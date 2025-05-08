import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  FormLayout,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
// import { authenticate } from "../shopify.server";
import VerificationCard from "./app.verificationCard";
import { useVerification } from "./context/verification.context";
import { redirect, useNavigate } from "react-router-dom";

export default function VerificationPage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [color, setColor] = useState("#000000");
  const [age, setAge] = useState(18);
  const [title, setTitle] = useState({
    text: "Welcome!",
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 26,
    text_color: "#000000",
  });

  console.log("title : ", title);

  const [description, setDescription] = useState({
    text: "Please verify that you are {{minimum_age}} years of age or older to enter this site.",
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 14,
    text_color: "#000000",
  });

  const [acceptButton, setAcceptButton] = useState({
    text: "Agree",
    border_radius: 5,
    border_width: 1,
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 16,
    text_color: "#000000",
    background_color: "#c8c8c8",
  });

  const [rejectButton, setRejectButton] = useState({
    text: "Disagree",
    border_radius: 5,
    border_width: 1,
    text_weight: "font-light",
    fonts: "font-sans",
    text_size: 16,
    text_color: "#000000",
    background_color: "#c8c8c8",
    redirect_url: "https://google.com/",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      setColor(val);
    }
  };

  return (
    <div className="flex ml-6">
      <div className=" w-[35%] ">
        <h1 className="text-2xl font-bold text-gray-800 justify-start mt-10 mb-8">
          Settings
        </h1>

        <div>
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
                onChange={() => setAge(e.target.value)}
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
                    onChange={(e) =>
                      setTitle({ ...title, [e.target.name]: e.target.value })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={title.text_color}
                    onChange={(e) =>
                      setTitle({ ...title, [e.target.name]: e.target.value })
                    }
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
                value={description.text}
                onChange={(e) =>
                  setDescription({
                    ...description,
                    [e.target.name]: e.target.value,
                  })
                }
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
                    name="text_size"
                    value={description.text_size}
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
                    name="text_size"
                    value={description.text_size}
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
                  value={acceptButton.text}
                  onChange={(e) =>
                    setAcceptButton({
                      ...acceptButton,
                      [e.target.name]: e.target.value,
                    })
                  }
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
                    placeholder="Enter age"
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
                    placeholder="Enter age"
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
                    placeholder="Enter age"
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
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={acceptButton.text_color}
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="background_color"
                    value={acceptButton.background_color}
                    onChange={(e) =>
                      setAcceptButton({
                        ...acceptButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-7 h-6 ml-7 p-0 border-black bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-7 mx-0 border-gray-300" />

            <div className="text-sm text-gray-800 mt-4 mb-3">Reject Button</div>
            <div className="flex gap-3">
              <div className="flex flex-col">
                <div className="text-[13px] text-gray-600 mb-1">Text</div>
                <input
                  type="text"
                  placeholder="Enter text"
                  name="text"
                  value={rejectButton.text}
                  onChange={(e) =>
                    setRejectButton({
                      ...rejectButton,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Radius
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    placeholder="Enter age"
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

              <div className="flex flex-col mr-2">
                <div className="text-[13px] text-gray-600 mb-1">
                  Border Width
                </div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    placeholder="Enter age"
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

              <div className="flex flex-col mr-2 w-1/3">
                <div className="text-[13px] text-gray-600 mb-1">Text Size</div>
                <div className="flex items-center border border-gray-500 rounded-md px-2 py-2">
                  <input
                    type="number"
                    placeholder="Enter age"
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
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="text_color"
                    value={rejectButton.text_color}
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name="background_color"
                    value={rejectButton.background_color}
                    onChange={(e) =>
                      setRejectButton({
                        ...rejectButton,
                        [e.target.name]: e.target.value,
                      })
                    }
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
                className="w-full px-3 py-2 border border-gray-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <div className="text-m text-gray-800 mb-2">Image</div>
          <Card>
            <div className="w-full max-w-md mx-auto">
              <label
                htmlFor="imageUpload"
                className="w-full h-48 bg-gray-200 border border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                <span className="text-gray-700 text-sm px-4 py-2 bg-white border border-gray-300 rounded shadow">
                  Upload File
                </span>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full max-h-64 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
