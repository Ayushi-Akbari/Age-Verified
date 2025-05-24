function extra () {
    return (
        <Page fullWidth>
          <div className="h-full w-full">
          <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
            {/* Left Section */}
            <div className="w-full lg:w-[36%] p-2 space-y-8">
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
                  <div className="flex gap-8 mt-5">
                    <RadioButton
                      label="Template 1"
                      checked={customization.layout === "template1"}
                      id="template1"
                      name="layout"
                      onChange={() =>
                        handleSectionChange("customization", "layout", "template1")
                      }
                    />
                    <RadioButton
                      label="Template 2"
                      checked={customization.layout === "template1"}
                      id="template2"
                      name="layout"
                      onChange={() =>
                        handleSectionChange("customization", "layout", "template2")
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
                        pattern="[0-9]*"
                        value={customization.age}
                        onChange={(value) => {
                          setRejectButton((prev) => ({
                            ...prev,
                            text: prev.text.replace(customization.age, value),
                          }));
    
                          setAcceptButton((prev) => ({
                            ...prev,
                            text: prev.text.replace(customization.age, value),
                          }));
    
                          setDescription((prev) => ({
                            ...prev,
                            text: prev.text.replace(customization.age, value),
                          }));
    
                          handleSectionChange("customization", "age", value);
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
                            checked={customization.date_fromat === "european_date"}
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
                          setDescription({
                            ...description,
                            text: value.replace(
                              "{{minimum_age}}",
                              customization.age,
                            ),
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
                          console.log("value : ", value);
    
                          setAcceptButton({
                            ...acceptButton,
                            text: value.replace(
                              "{{minimum_age}}",
                              customization.age,
                            ),
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
                            text: value.replace(
                              "{{minimum_age}}",
                              customization.age,
                            ),
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
                          label="Border Width"
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
                          label="Top And Bottom Padding"
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
                          label="Left And Right Padding"
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
                        <div className="h-[40px]">
                          <label className="text=[16px] text-[#313335] leading-tight block">
                            Background Color
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <TextField
                            label=""
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
                            className="w-[36px] h-[36px] border border-gray-300 rounded"
                          />
                        </div>
                      </div>
    
                      {/* Border Color */}
                      <div className="flex flex-col">
                        <div className="h-[40px]">
                          <label className=" text-gray-700 leading-tight block">
                            Border Color
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <TextField
                            label=""
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
                            className="w-[36px] h-[36px] border border-gray-300 rounded"
                          />
                        </div>
                      </div>
    
                      {/* Background Layer Opacity */}
                      <div className="flex flex-col ">
                        <div className="h-[40px]">
                          <label className="text-[#202223] leading-tight block">
                            Background Layer Opacity
                          </label>
                        </div>
                        <TextField
                          label=""
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
                            onDrop={(acceptedFiles) => handleDropZoneDrop(acceptedFiles, 'popUpBackground', 'image')}
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
                                      setPopUpBackground(prev => ({
                                        ...prev,
                                        image: null,
                                        imageFile: null
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
                        <label className="block text-sm font-medium mb-1">
                          Outer Layer Color
                        </label>
                        <div className="flex items-center border border-gray-][] rounded-lg overflow-hidden w-fit">
                          <input
                            type="text"
                            value={outerPopUpBackground.background_color}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                handleSectionChange("outerPopUpBackground","background_color",value)
                              }
                            }}
                            className="px-2 py-1 outline-none text-sm w-[90px]"
                          />
                          <input
                            type="color"
                            value={outerPopUpBackground.background_color}
                            onChange={(e) =>
                              handleSectionChange("outerPopUpBackground","background_color",e.target.value)
                            }
                            className="w-8 h-8 border-none p-0 cursor-pointer mr-1 rounded-lg"
                          />
                        </div>
                      </div>
    
                      <div className="flex-1">
                        <div className="flex-1">
                          <TextField
                            label="Background Layer Opacity"
                            value={outerPopUpBackground.outer_opacity}
                            onChange={(value) =>
                              handleSectionChange("outerPopUpBackground","outer_opacity",value)
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
                            handleSectionChange("outerPopUpBackground","image_enabale",!outerPopUpBackground.image_enabale)
                          }
                        />
                      </div>
                      {outerPopUpBackground.image_enabale && (
                        <Box marginx="auto">
                          <DropZone
                            accept="image/*"
                            onDrop={(acceptedFiles) => handleDropZoneDrop(acceptedFiles, 'outerPopUpBackground', 'image')}
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
                                      setOuterPopUpBackground(prev => ({
                                        ...prev,
                                        image: null,
                                        imageFile: null
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
                  <div className="flex mb-4 gap-7">
                    <Checkbox
                      label="Show Logo"
                      checked={popUpLogo.show_logo}
                      onChange={(value) =>
                        handleSectionChange("popUpLogo","show_logo",!popUpLogo.show_logo)
                      }
                    />
                    <Checkbox
                      label="Logo Square"
                      checked={popUpLogo.logo_square}
                      onChange={(value) =>
                        handleSectionChange("popUpLogo","logo_square",!popUpLogo.logo_square)
                      }
                    />
                  </div>
                  {popUpLogo.show_logo && (
                    <Box marginx="auto">
                    <DropZone
                      accept="image/*"
                      onDrop={(acceptedFiles) => handleDropZoneDrop(acceptedFiles, 'popUpLogo', 'image')}
                      allowMultiple={false}
                    >
                      <div className="relative p-[10px] flex justify-center items-center h-[100px]">
                        {popUpLogo.image ? (
                          <>
                            <div className={popUpLogo.logo_square ? "rounded-none overflow-hidden" : "rounded-full overflow-hidden"}>
                              <Thumbnail
                                source={popUpLogo.image}
                                alt="Uploaded image preview"
                                size="large"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPopUpLogo(prev => ({
                                  ...prev,
                                  image: null,
                                  imageFile: null
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
                      checked={displayCriteria.page === "all-pages"}
                      id="all-pages"
                      name="contact"
                      onChange={() =>
                        handleSectionChange("displayCriteria", "page", "all-pages")
                      }
                    />
                    <RadioButton
                      label="Specific Pages"
                      checked={displayCriteria.page === "specific-pages"}
                      id="specific-pages"
                      name="contact"
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
                          value={displayCriteria.url[0] || ""}
                          onChange={(value) => {
                            const newUrls = [...displayCriteria.url];
                            newUrls[0] = value;
                            handleSectionChange("displayCriteria", "url", newUrls);
                          }}
                          autoComplete="off"
                        />
                        {!displayCriteria.url[0] && (
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
                      <div className="flex h-[200px] mt-4">
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
            <div className="flex flex-col w-full mb-5 lg:mt-0 lg:mb-0 lg:w-[64%] lg:h-screen lg:fixed lg:right-0 lg:top-0 lg:p-1">
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
                    addSetting();
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    console.log("Discarding...");
                    document.getElementById("discard-button").click();
                    removeSetting();
                  }}
                >
                  Discard
                </Button>
              </div>
              <VerificationCard
                image={image}
                customization={customization}
                title={title}
                description={description}
                acceptButton={acceptButton}
                rejectButton={rejectButton}
                popUp={popUp}
                popUpBackground={popUpBackground}
                outerPopUpBackground={outerPopUpBackground}
                popUpLogo={popUpLogo}
                policy={policy}
                advanced={advanced}
              />
            </div>
          </div>
          </div>
        </Page>
      );
}