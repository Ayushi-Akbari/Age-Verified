import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from "react";
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

const Template2 = forwardRef((props, ref) => {

  const previewRef = useRef(null);

  const {image, customization, title, description, acceptButton, rejectButton, popUp, popUpBackground, outerPopUpBackground, popUpLogo, policy, advanced, addSetting} = props

  useImperativeHandle(ref, () => ({
    getHtmlContent: () => {
      if (previewRef.current) {
        return previewRef.current.innerHTML;
      }
      return "";
    },
  }));

  const currentYear = new Date().getFullYear();

  const range = (count, offset = 1, reverse = false) =>
    Array.from({ length: count }, (_, i) =>
      reverse ? currentYear - i : i + offset
    );

  const [selectedDay, setDay] = useState('1');
  const [selectedMonth, setMonth] = useState('1');
  const [selectedYear, setYear] = useState(`${currentYear}`);

  console.log("popUpBackground : ", popUpLogo);

  const selectStyle = {
    padding: '5px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#e0e0e0',
    color: '#000',
    fontSize: '14px',
    marginRight: '8px',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #dfe3e8",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            marginBottom: "0.75rem",
          }}
        >
          Preview
        </div>
        <div
          ref={previewRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div>
            <div
              style={{
                backgroundColor: outerPopUpBackground.background_color,
                opacity: outerPopUpBackground.background_opacity,
                ...(outerPopUpBackground.image_enabale && {
                  backgroundImage: `url(${outerPopUpBackground.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }),
                width: "100%",
                padding: "2rem 3rem",
                paddingTop: "5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                }}
              >
                {popUpLogo.image && popUpLogo.show_logo && !popUpBackground.image_enabale && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-50px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "100px",
                      borderRadius: popUpLogo.logo_square ? "0" : "50%",
                      overflow: "hidden",
                      zIndex: 10,
                      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <img
                      src={popUpLogo.image}
                    // src="http://localhost:8001/image/1748424761385-322912408.png"
                      alt="Popup Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: popUpLogo.logo_square ? "0" : "9999px",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    width: `${popUp.width}px`,
                    height: popUpBackground?.image_enabale
                      ? `${parseFloat(popUp.height) * 1.4}px`
                      : `${popUp.height}px`,

                    border: "2px solid white",
                    borderWidth: `${popUp.border_width}px`, //630
                    borderRadius: `${popUp.border_radius}px`,
                    backgroundColor: popUpBackground.background_color,
                    borderColor: popUpBackground.border_color,
                    opacity: popUpBackground.background_opacity,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {popUpBackground.image_enabale && (
                    <>
                      {/* Background Image Section */}
                      <div
                        style={{
                          width: "100%",
                          height: "35%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {popUpBackground.image ? (
                          <img
                            src={popUpBackground.image}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            alt="Popup background"
                          />
                        ) : null}
                      </div>

                      {/* Logo in between */}
                      {popUpLogo.image && popUpLogo.show_logo && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "-45px",
                            zIndex: 10,
                          }}
                        >
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: popUpLogo.logo_square ? "0" : "50%",
                              overflow: "hidden",
                              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                            }}
                          >
                            <img
                              src={popUpLogo.image}
                              alt="Popup Logo"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: popUpLogo.logo_square
                                  ? "0"
                                  : "9999px",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div
                    style={{
                      width: "100%",
                      minHeight: popUpBackground.image_enabale ? "65%" : "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxSizing: "border-box",
                      padding: `${Number(popUp.top_bottom_padding)}px ${Number(popUp.left_right_padding)}px`,
                    }}
                  >

                    <span
                      style={{
                        display: "block",
                        fontWeight: Number(title.text_weight),
                        fontSize: `${title.text_size}px`,
                        fontFamily: title.fonts,
                        color: title.text_color,
                        marginBottom: "20px",
                        ...((!popUpBackground.image_enabale && {marginTop: "3rem"}))
                      }}
                    >
                      {title.text}
                    </span>

                    <span
                      style={{
                        fontWeight: Number(description.text_weight),
                        fontSize: `${description.text_size}px`,
                        fontFamily: description.fonts,
                        color: description.text_color,
                        paddingInline: "2rem",
                        marginBottom: "8px",
                        textAlign: "center",
                      }}
                    >
                      {description.text}
                    </span>

                    {customization.verify_method === "via-birthdate" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                          padding: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection:
                              customization.date_fromat === "european_date"
                                ? "row"
                                : "row-reverse",
                          }}
                        >
                          <select
                            id="dateSelect"
                            style={{
                              padding: "7px 12px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              color: "#000",
                              fontSize: "14px",
                              marginRight: "8px",
                              cursor: "pointer",
                            }}
                            value={selectedDay}
                            onChange={(e) => setDay(e.target.value)}
                          >
                            {range(31).map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <select
                            id="monthSelect"
                            style={{
                              padding: "7px 20px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              color: "#000",
                              fontSize: "14px",
                              marginRight: "8px",
                              cursor: "pointer",
                            }}
                            value={selectedMonth}
                            onChange={(e) => setMonth(e.target.value)}
                          >
                            {range(12).map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <select
                          id="yearSelect"
                          style={{
                            padding: "7px 20px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            color: "#000",
                            fontSize: "14px",
                            marginRight: "8px",
                            cursor: "pointer",
                          }}
                          value={selectedYear}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          {range(100, 0, true).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "1rem",
                        width: "100%",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          // flexDirection: "column",
                          columnGap: "1rem",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <button
                          id="rejectButton"
                          style={{
                            transform: "scale(1)",
                            transition: "transform 0.1s",
                            fontSize: `${rejectButton.text_size}px`,
                            color: rejectButton.text_color,
                            backgroundColor: rejectButton.background_color,
                            borderWidth: `${rejectButton.border_width}px`,
                            borderColor: rejectButton.border_color,
                            borderRadius: `${rejectButton.border_radius}px`,
                            fontWeight: Number(rejectButton.text_weight),
                            fontFamily: rejectButton.fonts,
                            padding: "0.6rem 1.5rem",
                          }}
                        >
                          {rejectButton.text}
                        </button>

                        <button
                          id="acceptButton"
                          style={{
                            transform: "scale(1)",
                            transition: "transform 0.1s",
                            fontSize: `${acceptButton.text_size}px`,
                            color: acceptButton.text_color,
                            backgroundColor: acceptButton.background_color,
                            borderWidth: `${acceptButton.border_width}px`,
                            borderColor: acceptButton.border_color,
                            borderRadius: `${acceptButton.border_radius}px`,
                            fontWeight: Number(acceptButton.text_weight),
                            fontFamily: acceptButton.fonts,
                            padding: "0.6rem 1.5rem",
                          }}
                        >
                          {acceptButton.text}
                        </button>
                      </div>
                    </div>

                    <div
                      dangerouslySetInnerHTML={{ __html: policy.text }}
                      style={{ marginTop: "1.25rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
});

export default Template2;

 
