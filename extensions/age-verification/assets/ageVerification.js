document.addEventListener("DOMContentLoaded", main);

let popup_show, age;
let date, month, year;
async function main() {
  await fetchData();
  
  const popup = document.getElementById("popup-modal");
  console.log("popup_show : ", popup_show);

    //   let ageVerified
    // if(popup_show === true) {
    //   console.log();
      
    //   ageVerified = sessionStorage.getItem('age_verified')
    // }else{
    //   ageVerified = Cookies.get('age_verified');
    // }
    // console.log( "ageVerified : ", ageVerified);
    
    // if (ageVerified !== true) {
      popup.style.display = "flex";
    // } else {
    //   popup.style.display = "none";
    // }
  

  // if (popup_show !== true) {
  //   console.log("if");

  //   const cookie = Cookies.get('age_verified');
  //       console.log("cookie : ", cookie);
  //   if (cookie !== undefined) {
  //     console.log("inside");
  //     Cookies.remove('age_verified', {
  //       path: '/',
  //       secure: location.protocol === 'https:',
  //       sameSite: location.protocol === 'https:' ? 'None' : 'Lax'
  //     });

  //   }
  //   sessionStorage.setItem('age_verified', "null");
  // }else{
  //   console.log("else");
  //   console.log("sessionStorage.getItem('age_verified') : ", sessionStorage.getItem('age_verified'));
    
  //   if (sessionStorage.getItem('age_verified')) {
  //     sessionStorage.removeItem('age_verified');
  //   }
  //   const cookie = Cookies.get('age_verified');
  //   console.log("cookie : " , cookie);
  //   if (cookie === undefined || cookie === "null") {
  //     console.log("inside");
  //     Cookies.set('age_verified', 'true', {
  //       path: '/',
  //       expires: 30,
  //       secure: location.protocol === 'https:',  // only true on https
  //       sameSite: location.protocol === 'https:' ? 'None' : 'Lax'
  //     });

  //   }
  // }

  const container = document.getElementById('age-verification-dynamic-content');

container.addEventListener('click', (event) => {
  if (event.target && (event.target.id === 'acceptButton' || event.target.id === 'rejectButton')) {
    handleAgeVerification(event);
  }
});

container.addEventListener('change', (event) => {
  console.log("change : ");
  
  if (event.target && (event.target.id === 'monthSelect' || event.target.id === 'dateSelect' || event.target.id === 'yearSelect')) {
    handleBirthDate(event)
  }
});

}

async function fetchData() {
  try {

    const shopDomain = document.querySelector('[data-my-app-embed]')?.dataset.store;

    const response = await fetch(`http://localhost:8001/setting/get-setting?shop=${shopDomain}`);
    if (!response.ok) throw new Error('Network response was not ok');

    const newData = await response.json();
    const customizationRaw = newData?.data?.settings?.customization;
    let customization = {};

    try {
      customization = JSON.parse(customizationRaw);
      popup_show = customization?.popup_show
      age = customization?.age
    } catch (error) {
      console.error("Failed to parse customization JSON:", error);
    }


    const htmlContent = newData.data.html_content;
    const targetDiv = document.getElementById("age-verification-dynamic-content");

    if (targetDiv && htmlContent) {
      targetDiv.innerHTML = htmlContent;

    }

    return htmlContent;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

async function handleAgeVerification(event) { 
  if (event.target && (event.target.id === 'acceptButton' || event.target.id === 'rejectButton')) {
    const btn = event.target;
    console.log('Accept button clicked via delegation!');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);

    const popup = document.getElementById("popup-modal");

    if(event.target.id === 'acceptButton'){
      document.cookie = "age_verified=true; path=/; max-age=" + 60*60*24*30 + "; Secure; SameSite=None";
      if(document.cookie.split('; ').find(row => row.startsWith('age_verified='))?.split('=')[1] === 'true'){
        popup.style.display = "none";
        const data = {
          verified: true,
          shop: document.querySelector('[data-my-app-embed]')?.dataset.store
        };

        try {
          const response = await fetch('http://localhost:8001/analytics/add-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          console.log("Analytics data sent successfully.", response);
        } catch (error) {
          console.error("Failed to send analytics data:", error);
        }
        
      }
    }else if(event.target.id === 'rejectButton'){
      document.cookie = "age_verified=false; path=/; max-age=" + 60*60*24*30 + "; Secure; SameSite=None";
      if(document.cookie.split('; ').find(row => row.startsWith('age_verified='))?.split('=')[1] === 'false'){
        popup.style.display = "flex";

        const data = {
          verified: false,
          shop: document.querySelector('[data-my-app-embed]')?.dataset.store
        };

        try {
          const response = await fetch('http://localhost:8001/analytics/add-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          console.log("Analytics data sent successfully.", response);
        } catch (error) {
          console.error("Failed to send analytics data:", error);
        }
      }
    }
  }
}

async function handleBirthDate(){
  if(event.target.id === 'dateSelect'){
    date = event.target.value
  }else if(event.target.id === 'monthSelect'){
    month = event.target.value
  }else if(event.target.id === 'yearSelect'){
    year = event.target.value
  }
}
