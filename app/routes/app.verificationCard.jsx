import { Card } from "@shopify/polaris";
import { useEffect } from "react";
import axios from 'axios'

export default function VerificationPage({}) {

  useEffect(() => {
    
    fetchData();
  
    
  }, []);

  const fetchData = async () => {
    const settingData = await axios.get(`http://localhost:8001/user/get-setting`)

    console.log("settingData : " , settingData);
    };

  const handleYes = () => {
    localStorage.setItem("age_verified", "true");
    window.history.back(); // or redirect to store
  };

  const handleNo = () => {
    window.location.href = "https://google.com"; // deny access
  };

  return (
    <Card>
      <div className="bg-gray-400 p-10">
      <div className="bg-yellow-100 rounded-2xl shadow-2xl border-4 border-white sm:h-[300px] h-[400px] xs:w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[500px] p-4 flex flex-col sm:flex-row relative">
        <div className="sm:w-2/5 w-full flex justify-center items-center p-4">
          <img
            src="/lock.png"
            alt="Popup Image"
            width={300}
            height={300}
            className="object-contain rounded-lg w-full max-w-[300px]"
          />
        </div>
  
        <div className="sm:w-3/5 w-full flex flex-col justify-center p-4 text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-800 mb-4">title</h1>
          <p className="text-sm text-gray-600 mb-6">message</p>
          <div className="flex flex-col space-y-3">
            <button
              // onClick={handleNo}
              className="border border-yellow-600 text-yellow-800 font-medium py-2 rounded-lg hover:bg-yellow-200 transition"
            >
              rejectMessage
            </button>
            <button
              // onClick={handleYes}
              className="bg-blue-700 text-white font-medium py-2 rounded-lg hover:bg-blue-800 transition"
            >
              acceptMessage
            </button>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
  

}
