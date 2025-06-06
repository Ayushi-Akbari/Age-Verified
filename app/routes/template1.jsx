import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from "react";
import axios from "axios";

const Template1 = forwardRef((props, ref) => {

  const previewRef = useRef(null);

  const { customization, title, description, acceptButton, rejectButton, popUp, popUpBackground, outerPopUpBackground, popUpLogo, policy, advanced, addSetting} = props.data

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
          width: "95%",
          // minHeight: "50vh",
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
              padding: "3rem 3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "row",
                  width: `${popUp.width}px`,
                  height: `${popUp.height}px`,
                  border: "2px solid white",
                  borderWidth: `${popUp.border_width}px`,
                  borderRadius: `${popUp.border_radius}px`,
                  // paddingLeft: `${popUp.top_bottom_padding}px`,
                  // paddingRight: `${popUp.left_right_padding}px`,
                  backgroundColor: popUpBackground.background_color,
                  borderColor: popUpBackground.border_color,
                  opacity: popUpBackground.background_opacity,
                }}
              >
                {popUpBackground.image_enabale && (
                  <div
                    style={{
                      width: "45%",
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
                          borderTopLeftRadius: `${popUp.border_radius}px`,
                          borderBottomLeftRadius: `${popUp.border_radius}px`, 
                        }}
                        alt="Popup background"
                      />
                    ) : null}
                  </div>
                )}

                <div
                  style={{
                    width: popUpBackground.image_enabale ? "55%" : "100%",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: popUpLogo.show_logo ? "0.5rem" : "3rem",
                    // justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "1rem",
                    textAlign: "center",
                  }}
                >
                  {popUpLogo.show_logo && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "1rem",
                        width: "100px",
                        height: "100px",
                        marginBottom: "1.2rem"
                      }}
                    >
                      {popUpLogo.image ? (
                        <img
                          src={popUpLogo.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: popUpLogo.logo_square
                              ? "0"
                              : "9999px",
                          }}
                          alt="Popup Logo"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </div>
                  )}

                  <span
                    style={{
                      display: "block",
                      fontWeight: Number(title.text_weight),
                      fontSize: `${title.text_size}px`,
                      fontFamily: title.fonts,
                      color: title.text_color,
                      marginBottom: "20px",
                    }}
                  >
                    {title.text}
                  </span>

                  <span
                    style={{
                      display: "inline-block",
                      fontWeight: Number(description.text_weight),
                      fontSize: `${description.text_size}px`,
                      fontFamily: description.fonts,
                      color: description.text_color,
                      // maxWidth: "90%",
                      lineHeight: "2",
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
                        columnGap: "1rem",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >

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
                          width: "fit-content",
                        }}
                      >
                        {acceptButton.text}
                      </button>
                      
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
                          width: "fit-content",
                        }}
                      >
                        {rejectButton.text}
                      </button>

                      
                    </div>
                  </div>

                  {policy.checked && (
                    <div
                    dangerouslySetInnerHTML={{ __html: policy.text }}
                    style={{ marginTop: "1.25rem" }}
                  />
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
});

export default Template1;

 
