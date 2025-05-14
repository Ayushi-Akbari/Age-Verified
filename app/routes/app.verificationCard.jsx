import { useEffect } from "react";
import axios from "axios";

import {
  Page,
  Layout,
  Text,
  TextField,
  Select,
  ColorPicker,
  Card,
  FormLayout,
  Box,
  Button,
  Thumbnail,
} from "@shopify/polaris";

export default function VerificationPage({age,image, description, acceptButton, rejectButton, title, hasChanges, setHasChanges, addSetting}) {
  useEffect(() => {
    if (hasChanges) {
      document.getElementById('my-save-bar')?.show();
    }
  }, [hasChanges]);

  useEffect(() => {
    const saveBtn = document.getElementById('save-button');
    const discardBtn = document.getElementById('discard-button');

    saveBtn?.addEventListener('click', () => {
      console.log('Saving');
      setHasChanges(false);
      document.getElementById('my-save-bar')?.hide();
    });

    discardBtn?.addEventListener('click', () => {
      console.log('Discarding');
      setHasChanges(false);
      document.getElementById('my-save-bar')?.hide();
    });

    return () => {
      saveBtn?.removeEventListener('click', () => {});
      discardBtn?.removeEventListener('click', () => {});
    };
  }, []); 

  return (
    <>
      <ui-save-bar id="my-save-bar">
        <button variant="primary" id="save-button">
          Save
        </button>
        <button id="discard-button">Discard</button>
      </ui-save-bar>

      <div className="absolute top-4 right-4 flex justify-end z-10 space-x-4">
        <Button
          variant="primary"
          onClick={() => {
            console.log("Saving...");
            document.getElementById("save-button").click();
            addSetting()
          }}
        >
          Save
        </Button>
        <Button
          variant="primary"
          onClick={() => {
             console.log("Discarding...");
            document.getElementById("discard-button").click();
          }}
        >
          Discard
        </Button>
      </div>

      <div className="flex justify-center items-center h-full">
        <Card className="w-full">
          <div className="bg-gray-100 p-4">
            <div className="bg-yellow-100 w-[450px] h-[250px] rounded-lg shadow-md border-2 border-white flex flex-row p-4">
              <div className="w-2/5 flex justify-center items-center p-4">
                <img
                  src={image}
                  alt="Popup"
                  className="w-[150px] h-[150px] object-cover rounded-lg"
                />
              </div>

              <div className="w-3/5 p-4 flex flex-col justify-center">
                <Text>
                  <span
                    style={{
                      display: "block",
                      fontWeight: Number(title.text_weight),
                      fontSize: `${title.text_size}px`,
                      fontFamily: title.fonts,
                      color: title.text_color,
                      marginBottom: "10px",
                    }}
                  >
                    {title.text}
                  </span>
                </Text>
                <Text>
                  <span
                    style={{
                      fontWeight: Number(description.text_weight),
                      fontSize: `${description.text_size}px`,
                      fontFamily: description.fonts,
                      color: description.text_color,
                    }}
                  >
                    {description.text}
                  </span>
                </Text>
                <div className="mt-4">
                  <div className="flex flex-col space-y-4">
                    <button
                      // onClick={handleNo}
                      className={`border py-1.5 rounded-lg active:scale-95`}
                      style={{
                        fontSize: `${rejectButton.text_size}px`,
                        color: rejectButton.text_color,
                        backgroundColor: rejectButton.background_color,
                        borderWidth: `${rejectButton.border_width}px`,
                        borderColor: rejectButton.border_color,
                        borderRadius: `${rejectButton.border_radius}px`,
                        fontWeight: Number(rejectButton.text_weight),
                        fontFamily: rejectButton.fonts,
                      }}
                    >
                      {rejectButton.text}
                    </button>
                    <button
                      // onClick={handleYes}
                      className={`border py-1.5 rounded-lg active:scale-95`}
                      style={{
                        fontSize: `${acceptButton.text_size}px`,
                        color: acceptButton.text_color,
                        backgroundColor: acceptButton.background_color,
                        borderWidth: `${acceptButton.border_width}px`,
                        borderColor: acceptButton.border_color,
                        borderRadius: `${acceptButton.border_radius}px`,
                        fontWeight: Number(acceptButton.text_weight),
                        fontFamily: acceptButton.fonts,
                      }}
                    >
                      {acceptButton.text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
