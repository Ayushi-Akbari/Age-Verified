import { Card, Text, Button, Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import { useVerification } from "./context/verification.context";
import { Image } from '@shopify/hydrogen-react';

export default function VerificationPage({}) {

//   const { verificationData } = useVerification();


    const ageLimit = 18            
    const mainTitle = "Age Verification"
    const message = `You must be ${ageLimit} years old to access this website. Please verify your age.`
    const acceptMessage = `Yes, I’m over ${ageLimit}`
    const rejectMessage = `No, I’m under ${ageLimit}`
    const imagePreview =""
  

  useEffect(() => {
    console.log("ageLimit state:", ageLimit, message, mainTitle, acceptMessage, rejectMessage);
    console.log("imagePreview : ", imagePreview);
    
  }, [ageLimit, message, mainTitle, acceptMessage, rejectMessage]);

  const handleYes = () => {
    localStorage.setItem("age_verified", "true");
    window.history.back(); // or redirect to store
  };

  const handleNo = () => {
    window.location.href = "https://google.com"; // deny access
  };

  return (

    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
        <div style={{ width: "78%", margin: "0 auto" }}>
          <Card sectioned>
            <div style={{ display: "flex", alignItems: "center" , margin:"8px", marginTop: "20px"}}>

              <div style={{ width: "40%" }}>
                <Image
                  src={imagePreview || '/lock.png'}
                  alt="Age Verification Lock"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    sizes:"(max-width: 768px) 100vw, 800px"
                  }}
                />
              </div>

              <div style={{ width: "60%", paddingLeft: "20px", hight: "50%" }}>
                <div>
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    marginBottom: "10px",
                    whiteSpace: "nowrap",
                    // textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {mainTitle}
                </h3>
                  <p style={{ marginTop: "20px", marginBottom: "20px" }}>
                    {message}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Button primary style={{width: "60%",height: "60px", border: "2px solid black", boxSizing: "border-box"}} onsubmit={handleYes}>{acceptMessage}</Button>
                  <Button tone="critical" style={{width: "60%",height: "60px", border: "2px solid black", boxSizing: "border-box"}} onsubmit={handleNo}>{rejectMessage}</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
