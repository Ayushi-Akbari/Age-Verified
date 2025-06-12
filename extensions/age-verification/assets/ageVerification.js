document.addEventListener("DOMContentLoaded", main);

let popup_show, age;
let day, month, year;
let country, language
let url, redirect_url, date_format, fp = null
async function main() {
  const country = window.shopifyMarket.country?.toUpperCase();
  const language = window.shopifyMarket.language?.toUpperCase();

  await fetchData(country, language);

  const popup = document.getElementById("popup-model");

  if (popup_show === true) {
    const cookie = Cookies.get("age_verified");
    if (cookie !== undefined) {
      Cookies.remove("age_verified", {
        path: "/",
        secure: location.protocol === "https:",
        sameSite: location.protocol === "https:" ? "None" : "Lax",
      });
    }
  } else {
    if (sessionStorage.getItem("age_verified")) {
      sessionStorage.removeItem("age_verified");
    }
  }

  await handlePopup()

  const input = document.getElementById("datePicker");

  flatpickr("#datePicker", {
    dateFormat: date_format === "european_date" ? "d-m-Y" : "m-d-Y",
    maxDate: "today", 
    defaultDate: "today",
    position: "below",
    appendTo: document.querySelector("#date-wrapper"),
    onReady: function (selectedDates, dateStr, instance) {
      instance.calendarContainer.classList.add("custom-flatpickr");
    },
    onChange: function (selectedDates, dateStr) {
    let dd, mm, yyyy;
    if (date_format === "european_date") {
      [dd, mm, yyyy] = dateStr.split("-");
    } else {
      [mm, dd, yyyy] = dateStr.split("-");
    }

    year = parseInt(yyyy);
    month = parseInt(mm);
    day = parseInt(dd);
  },
  });

  const container = document.getElementById("age-verification-dynamic-content");

  container.addEventListener("click", (event) => {
    if (
      event.target &&
      (event.target.id === "acceptButton" || event.target.id === "rejectButton")
    ) {
      handleAgeVerification(event);
    }
  });
}

async function handlePopup() {
  const popup = document.getElementById("popup-model");
  if (!popup) return;

  let matchFound = true;
  if (Array.isArray(url) && url.length) {
    const urlLocation = window.location.href.split('?')[0];
    matchFound = url.some(u => u === urlLocation);
  }

  if (!matchFound) {
    popup.style.display = "none";
    return;
  }

  const isVerified = popup_show
    ? sessionStorage.getItem("age_verified") === "true"
    : Cookies.get("age_verified") === "true";

  popup.style.display = isVerified ? "none" : "flex";
  console.log("popup.style.display : ", popup.style.display);
  
}

async function fetchData(country, language) {
  try {
    const shopDomain = document.querySelector('[data-my-app-embed]')?.dataset.store;

    const response = await fetch(`http://localhost:8001/setting/get-setting?shop=${shopDomain}&country=${country}&language=${language}`);
    if (!response.ok) throw new Error('Network response was not ok');

    const newData = await response.json();
    const htmlContent = newData.data.html_content;
    const targetDiv = document.getElementById("age-verification-dynamic-content");

    if (targetDiv && htmlContent) {
      targetDiv.innerHTML = htmlContent;  
    }    
    const customization = JSON.parse(newData?.data?.settings?.customization)
    const displayCriteria = JSON.parse(newData?.data?.settings?.displayCriteria)
    const rejectButton = JSON.parse(newData?.data?.settings?.rejectButton)
    const advanced = JSON.parse(newData?.data?.settings?.advanced)

    const outerBackground = document.getElementById("outer-background");

    if (outerBackground) {
      outerBackground.style.padding = "0";
      outerBackground.style.margin = "0";
      outerBackground.style.position = "fixed";
      outerBackground.style.top = "0";
      outerBackground.style.left = "0";
      outerBackground.style.width = "100vw";
      outerBackground.style.height = "100vh";
      outerBackground.style.zIndex = "-1";
      outerBackground.style.display = "flex";
      outerBackground.style.justifyContent = "center";
      outerBackground.style.alignItems = "center";
    }


    try {
      popup_show = customization?.popup_show
      age = customization?.age
      date_format = customization?.date_format
      if(displayCriteria.page === "specific-pages"){
        url = displayCriteria.url
      }
      redirect_url = rejectButton.redirect_url
      if(advanced.script){
        let script = advanced.script
        handleScript(script)
      }
      if(advanced.css){
        let css = advanced.css
        handleCss(css)
      }
      
    } catch (error) {
      console.error("Failed to parse customization JSON:", error);
    }

    return htmlContent;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

async function handleAgeVerification(event) {
  const btn = event.target;
  console.log("Accept button clicked via delegation!");
  btn.style.transform = "scale(0.95)";
  setTimeout(() => {
    btn.style.transform = "scale(1)";
  }, 150);

  const popup = document.getElementById("popup-model");

  if (event.target.id === "acceptButton") {
    const age = verifyAge();

    if (age) {
      let isVerify;
      if (popup_show) {
        sessionStorage.setItem("age_verified", "true");
        isVerify = sessionStorage.getItem("age_verified");
      } else {
        Cookies.set("age_verified", "true", {
          path: "/",
          expires: 30,
          secure: location.protocol === "https:",
          sameSite: location.protocol === "https:" ? "None" : "Lax",
        });
        isVerify = Cookies.get("age_verified");
      }
      if (isVerify === "true") {
        popup.style.display = "none";
        const data = {
          country: country,
          language: language,
          verified: true,
          shop: document.querySelector("[data-my-app-embed]")?.dataset.store,
        };

        try {
          const response = await fetch(
            "http://localhost:8001/analytics/add-analytics",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            },
          );
          console.log("Analytics data sent successfully.", response);
        } catch (error) {
          console.error("Failed to send analytics data:", error);
        }
      }
    } else {
      const errorDiv = document.getElementById("error");
      if (errorDiv) {
        errorDiv.textContent = "You are not eligible to show store..!";
        errorDiv.style.color = "red";
        errorDiv.style.display = "block";
        setTimeout(() => {
          errorDiv.textContent = "";
          errorDiv.style.display = "none";
        }, 5000);
      }
    }
  } else if (event.target.id === "rejectButton") {
    let isVerify;
    if (popup_show) {
      console.log("inside poup");

      sessionStorage.setItem("age_verified", "false");
      isVerify = sessionStorage.getItem("age_verified");
      console.log("isVerify : ", isVerify);
    } else {
      console.log("inside poup else");
      Cookies.set("age_verified", "false", {
        path: "/",
        expires: 30,
        secure: location.protocol === "https:",
        sameSite: location.protocol === "https:" ? "None" : "Lax",
      });
      isVerify = Cookies.get("age_verified");
      console.log("isVerify else: ", isVerify);
    }
    if (isVerify === "false") {
      popup.style.display = "flex";
      const data = {
        country: country,
        language: language,
        verified: false,
        shop: document.querySelector("[data-my-app-embed]")?.dataset.store,
      };
      try {
        const response = await fetch(
          "http://localhost:8001/analytics/add-analytics",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );
        console.log("Analytics data sent successfully.", response);
        if(response.status === 200){

        if (typeof redirect_url !== 'undefined' && redirect_url) {
            window.location.href = redirect_url;
        } else {
          console.warn("redirect_url is undefined or empty:", redirect_url);
        }

        }
      } catch (error) {
        console.error("Failed to send analytics data:", error);
      }
    }
  }
}

function verifyAge() {
  console.log("date : ", day , " : month : ", month ," :year : " , year , " : age : ", age);
  
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let ageValue = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    ageValue -= 1;
  }

  return ageValue >= age;
}

function handleScript(script) {
  if (!script) {
    return;
  }
  try {
    const customJs = script ? atob(script) : "";
    var scriptElement = document.createElement("script");
    scriptElement.textContent = customJs;
    const data = document.head.appendChild(scriptElement);
  } catch (e) {
    console.error("Failed to decode or inject Base64 script:", e.message);
  }
}

function handleCss(css){
if (!css) {
    return;
  }
  try {
    const customCss = (css) ? decodeURIComponent(escape(atob(css))) : '';
    const cssWithImportant = customCss.replace(
      /([a-zA-Z-]+\s*:\s*[^;{}]+)(;?)/g,
      (match, declaration, semicolon) => {
        console.log("match : ", match);
        console.log("declaration : ", declaration);
        console.log("semicolon : ", semicolon);

        if (declaration.includes("!important")) return match;
        return `${declaration.trim()} !important${semicolon || ""}`;
      },
    );
    var styleElement = document.createElement('style');
    styleElement.textContent = cssWithImportant;
    const data = document.head.appendChild(styleElement);
  } catch (e) {
    console.error("Failed to decode or inject Base64 script:", e.message);
  }
}
