async function fetchData() {
  try {
    console.log("fetch Data");
    const response = await fetch('http://localhost:8001/user/showSetting');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const newData = await response.json();
    console.log("Data aa gaya ", newData);
    // console.log("data bro", newData.Data.verification.value);

    // data = newData;

    DOMCondition(newData);
    DOMUpdate(newData); 
    
    let globalData = newData;


    return newData;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}


fetchData();