document.addEventListener("DOMContentLoaded", async() => {

  const ageVerified = checkAgeVerified("age_verified");
  const popup = document.getElementById("popup-modal");

  console.log('ageVerified value:', ageVerified, typeof ageVerified);

  if (!ageVerified) {
    console.log("inside false");
    popup.style.display = "flex";
  }else{
    console.log("inside true");
    popup.style.display = "none";
  }
  fetchData();

  document.getElementById('age-verification-dynamic-content').addEventListener('click', async(event) => {
    handleAgeVerification(event);
  });
  
});

async function fetchData() {
  try {

    const shopDomain = document.querySelector('[data-my-app-embed]')?.dataset.store;

    const response = await fetch(`http://localhost:8001/setting/get-setting?shop=${shopDomain}`);
    if (!response.ok) throw new Error('Network response was not ok');

    const newData = await response.json();
    // console.log("Fetched data:", newData);

    const htmlContent = newData.data.html_content;
    const targetDiv = document.getElementById("age-verification-dynamic-content");

    if (targetDiv && htmlContent) {
      console.log("inside target");
      
      targetDiv.innerHTML = htmlContent;
      // console.log("targetDiv.innerHTML = htmlContent; : ", targetDiv.innerHTML );
      
    }

    return htmlContent;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

function checkAgeVerified() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; age_verified=`);
  console.log("parts : " , parts);
  
  if (parts.length === 2) {
    const cookieVal = parts.pop().split(';').shift();
    if (cookieVal === "true") return true;
    if (cookieVal === "false") return false;
  }
  return null;
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
