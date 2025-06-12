import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from "react";

function hexToRgba(hex, opacity) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const Template3 = forwardRef((props, ref) => {

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

  //   console.log("popUpLogo : ", popUpLogo);
  // console.log("popUpBackground : ", popUpBackground);
  // console.log("popUpOuter : ", outerPopUpBackground);

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
              id="outer-background"
              style={{
                backgroundColor: hexToRgba(outerPopUpBackground.background_color, (
                    outerPopUpBackground.background_opacity >= 0 && outerPopUpBackground.background_opacity <= 1
                      ? outerPopUpBackground.background_opacity
                      : 0.8
                    )), 
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
                    flexDirection: "column",
                    width: (popUp.width >= 100 && popUp.width <= 650) ? `${popUp.width}px` : 620,
                    height: (popUp.height >= 50 && popUp.height <= 650) ? `${popUp.height}px` : 400,
                    border: "2px solid white",
                    borderWidth: (popUp.border_width >= 0 && popUp.border_width <= 10) ? `${popUp.border_width}px` : 1,
                    borderRadius: (popUp.border_radius >= 1 && popUp.border_radius <= 20) ? `${popUp.border_radius}px` : 20,
                    backgroundColor: popUpBackground.background_color,
                    borderColor: popUpBackground.border_color,
                    opacity: (popUpBackground.background_opacity >= 0 && popUpBackground.background_opacity <= 1)? popUpBackground.background_opacity: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    ...(popUpBackground.image_enabale && {
                      backgroundImage: `url(${popUpBackground.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }),
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                      padding:
                        (popUp.top_bottom_padding >= 0 && popUp.top_bottom_padding <= 100 &&
                        popUp.left_right_padding >= 0 && popUp.left_right_padding <= 100)
                          ? `${Number(popUp.top_bottom_padding)}px ${Number(popUp.left_right_padding)}px`
                          : "25 30",                    
                        }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        width: "100%",
                        textAlign: "left",
                        height: "130px",
                        boxSizing: "border-box",
                        padding: popUpLogo.show_logo ? "0 1rem" : "0 4rem",
                      }}
                    >
                      {popUpLogo.show_logo && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "1rem",
                            width: "130px",
                            height: "130px",
                            flexShrink: 0,
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
                            <div style={{ width: "100%", height: "100%" }} />
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          maxWidth: "600px",
                          boxSizing: "border-box",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: Number(title.text_weight),
                            fontSize: (title.text_size >= 26 && title.text_size <= 60) ? `${title.text_size}px` : 35,
                            fontFamily: title.fonts,
                            color: title.text_color,
                            marginBottom: "25px",
                            display: "block",
                          }}
                        >
                          {title.text}
                        </span>

                        <span
                          style={{
                            fontWeight: Number(description.text_weight),
                            fontSize: (description.text_size >= 13 && description.text_size <= 25) ? `${description.text_size}px` : 14,
                            fontFamily: description.fonts,
                            color: description.text_color,
                            marginBottom: "0px",
                            display: "block",
                          }}
                        >
                          {description.text}
                        </span>
                      </div>
                    </div>

                    {customization.verify_method === "via-birthdate" && (
                      <div className="flex flex-col">
                        <div
                          id="date-wrapper"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "8px",
                            padding: "5px",
                          }}
                        >
                          <input
                            id="datePicker"
                            type="text"
                            readOnly
                            style={{
                              padding: "0.5rem 1rem",
                              fontSize: "14px",
                              width: "200px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              cursor: "pointer",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            placeholder={
                              customization.date_format === "european_date"
                                ? "DD/MM/YYYY"
                                : "MM/DD/YYYY"
                            }
                          />
                        </div>
                        <div id="error"></div>
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
                          id="acceptButton"
                          style={{
                            transform: "scale(1)",
                            transition: "transform 0.1s",
                            fontSize: `${acceptButton.text_size}px`,
                            color: acceptButton.text_color,
                            backgroundColor: acceptButton.background_color,
                            borderWidth: (acceptButton.border_width >= 0 && acceptButton.border_width <= 10)? `${acceptButton.border_width}px`: 1,
                            borderColor: acceptButton.border_color,
                            borderRadius: (acceptButton.border_radius >= 0 && acceptButton.border_radius <= 30)? `${acceptButton.border_radius}px`: 6,
                            fontWeight: Number(acceptButton.text_weight),
                            fontFamily: acceptButton.fonts,
                            padding: "0.6rem 1.5rem",
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
                            borderWidth: (rejectButton.border_width >= 0 && rejectButton.border_width <= 10)? `${rejectButton.border_width}px`: 1,
                            borderColor: rejectButton.border_color,
                            borderRadius: (rejectButton.border_radius >= 0 && rejectButton.border_radius <= 30)? `${rejectButton.border_radius}px`: 6,
                            fontWeight: Number(rejectButton.text_weight),
                            fontFamily: rejectButton.fonts,
                            padding: "0.6rem 1.5rem",
                          }}
                        >
                          {rejectButton.text}
                        </button>
                      </div>
                    </div>
                    {policy.checked && (
                      <div
                        dangerouslySetInnerHTML={{ __html: policy.text }}
                        style={{
                          marginTop: "1.25rem",
                          textAlign: "left",
                          alignSelf: "flex-start",
                          padding: popUpLogo.show_logo ? "0 3rem" : "0 4rem",
                          boxSizing: "border-box",
                          width: "100%",
                          maxWidth: "600px",
                        }}
                      />
                    )}
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

export default Template3;