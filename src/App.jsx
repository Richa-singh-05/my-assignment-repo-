import { useState } from "react";
import UserHub from "./components/userHub/User";
import EnquiryForm from "./components/enquiry/EnquiryForm";

const tabs = [
  { id: "userhub", label: "User Hub" },
  { id: "form", label: "Contact Us" },
  { id: "email", label: "Emailer" },
];
export default function App() {
  const [activeTab, setActiveTab] = useState("userhub");
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* header code  */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold"> TechNova Dashboard </h1>
        </div>
      </header>
       {/* ================ tab ========= */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-1 sm:gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={` px-2 sm:px-4  py-1 sm:py-2 rounded-lg border ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >{tab.label} </button>
          ))}
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2 py-1 sm:py-4">
        {activeTab === "userhub" && <UserHub />}
        {activeTab === "form" && <EnquiryForm />}
         {activeTab === "email" && (
          <div className="bg-white border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4"> Template </h2>
            <button
              onClick={() =>
                window.open("/email.html", "_blank")
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"  >View Email Template </button>
          </div>
        )}
      </main>
    </div>
  );
}
