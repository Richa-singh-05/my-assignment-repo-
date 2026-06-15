import { useState, useEffect } from "react";

export default function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    country: "",
    enquiryType: "Personal",
    companyName: "",
    employees: "",
    subject: "",
    message: "",
    terms: false,
  });

useEffect(() => {
  fetchCountries();
}, []);

async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const data = await response.json();
    setCountries(
      data
         .map((country) => country.name.common)
        .sort()
    );
  } catch (error) {
    setCountries([
      "Australia",
      "Canada",
      "India",
      "United Kingdom",
      "United States",
    ]);
  }
}

  useEffect(() => {
    const isBiz = form.enquiryType === "Business" || form.enquiryType === "Partnership";
    if (!isBiz) {
      setForm((currentForm) => ({ ...currentForm, companyName: "", employees: "" }));
    }
  }, [form.enquiryType]);

  // handlechange functiom : when user type input

  function handleChange(e) {

          const name = e.target.name;
          const value = e.target.value;
          const type = e.target.type;
          const checked = e.target.checked; 

    if (name === "phone") {
      setForm((currentForm) => ({ ...currentForm, phone: value.replace(/[^0-9+\s]/g, "") }));
      setErrors((currentErrors) => ({ ...currentErrors, phone: "" }));
      return;
    }
    if (name === "firstName" || name === "lastName" || name === "subject") {
      setForm((currentForm) => ({ ...currentForm, [name]: value.replace(/[^a-zA-Z\s]/g, "") }));
      setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
      return;
    }
    setForm((currentForm) => ({ ...currentForm, [name]: type === "checkbox" ? checked : value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));

  }

// Age calculation
  function isOver18(dob) {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18;
  }

  // input fields calculations
  function validateStep1() {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Enter a valid email";
    if (!form.phone.trim()) err.phone = "Phone is required";
    if (!form.dob) err.dob = "Date of birth is required";
    else if (!isOver18(form.dob)) err.dob = "You must be at least 18 years old";
    if (!form.country) err.country = "Please select a country";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  //  step 2 - enquiry form 

  function validateStep2() {
    const err = {};
    const isBiz = form.enquiryType === "Business" || form.enquiryType === "Partnership";
    if (isBiz) {
      if (!form.companyName.trim()) err.companyName = "Company name is required";
      if (!form.employees) err.employees = "Please select employee range";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }
  //  step 3 - msg 
  function validateStep3() {
    const err = {};
    if (!form.subject.trim()) err.subject = "Subject is required";
    if (!form.message.trim()) err.message = "Message is required";
    if (!form.terms) err.terms = "Please accept the terms";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) { setStep(2); setErrors({}); }
    if (step === 2 && validateStep2()) { setStep(3); setErrors({}); }
  }

  function handleBack() {
    setStep((currentStep) => currentStep - 1);
    setErrors({});
  }

  function handleSubmit() {
    if (!validateStep3()) return;
    setSubmitted(true);
  }
  
  // submit another form funcntion 
  function handleReset() {
    setSubmitted(false);
    setStep(1);
    setErrors({});
    setForm({
      firstName: "", lastName: "", email: "", phone: "", dob: "", country: "",
      enquiryType: "Personal", companyName: "", employees: "",
      subject: "", message: "", terms: false,
    });
  }

  const isBiz = form.enquiryType === "Business" || form.enquiryType === "Partnership";

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow p-5  sm:p-10 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-green-600 mb-2">Form Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thanks <strong>{form.firstName}</strong>! We will contact you at <strong>{form.email}</strong>
          </p>
          <button onClick={handleReset} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow p-4 sm:p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Contact Us</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Fill the form and we will get back to you</p>

        {/*=== top : progress  bar code ============*/}
        <div className="flex items-center mb-8">

          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${step > 1 ? "bg-green-500" : "bg-blue-600"}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`text-xs mt-1 hidden sm:block text-gray-400 ${step === 1 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Personal</span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded ${step > 1 ? "bg-green-400" : "bg-gray-200"}`} />

          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${step > 2 ? "bg-green-500" : step === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
              {step > 2 ? "✓" : "2"}
            </div>
            <span className={`text-xs mt-1 hidden sm:block text-gray-400 ${step === 2 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Enquiry</span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded ${step > 2 ? "bg-green-400" : "bg-gray-200"}`} />

          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${step === 3 ? "bg-blue-600" : "bg-gray-300"}`}>
              3
            </div>
            <span className={`text-xs mt-1 hidden sm:block text-gray-400 ${step === 3 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Message</span>
          </div>

        </div>

        {/* =====personal info section============= */}
        {step === 1 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <input  name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter Your First Name" className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.firstName ? "border-red-400 bg-red-50" : "border-gray-200"}`}/>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter Your Last Name"
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${errors.lastName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter Your Email id "
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <input name="phone" type="tel" value={form.phone}  onChange={handleChange}  placeholder="Enter Your Phone Number with Country Code" maxLength={15}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-3 ">
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth (18+)</label>
              <input name="dob"  type="date" value={form.dob} onChange={handleChange}
                className={`w-[90%]  sm:w-full  min-w-0 bg-white  text-gray-500 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${form.dob ? "text-black" : "text-gray-500"}  ${errors.dob ? "border-red-400 bg-red-50" : "border-gray-200"}`}  />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
              <select name="country" value={form.country} onChange={handleChange}
                className={`w-full bg-white border   rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${form.country ? "text-black" : "text-gray-500" }  ${errors.country ? "border-red-400 bg-red-50" : "border-gray-200"}`} >
                <option value="">— Select country —</option>
                {countries.map((countryName) => (
                  <option key={countryName} value={countryName}>{countryName}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">
              Continue
            </button>
          </div>
        )}

       {/* =====================enquiry section code ============ */}
        {step === 2 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Enquiry Type</p>

            <div className="flex flex-wrap gap-4 mb-4">
              {["Personal", "Business", "Partnership", "Other"].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="enquiryType" value={type} checked={form.enquiryType === type} onChange={handleChange} className="accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>

            {isBiz && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                <p className="text-xs text-blue-500 font-semibold mb-3"> Extra info needed for {form.enquiryType}</p>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                  <input name="companyName" value={form.companyName} onChange={handleChange}  placeholder="Ambuza Corp"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.companyName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Number of Employees</label>
                  <select
                    name="employees"
                    value={form.employees}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.employees ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="">— Select range —</option>
                    {["1–10", "11–50", "51–200", "201–500", "500+"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  {errors.employees && <p className="text-red-500 text-xs mt-1">{errors.employees}</p>}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleBack} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm"> Back</button>
              <button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">Continue </button>
            </div>
          </div>
        )}

      {/* ============= Msg section==================== */}
        {step === 3 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Message</p>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-600">Message</label>
                <span className={`text-xs ${form.message.length > 450 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                  {form.message.length} / 500
                </span>
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Write your message..."
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center gap-3 mt-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="accent-blue-600 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
            
            {/* ===========bottom button : back & submit code ================= */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleBack} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm">Back</button>
              <button onClick={handleSubmit} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm">Submit </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
