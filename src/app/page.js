"use client";

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle2, User, FileText, AlertTriangle, Stethoscope, FileSignature, X, PenTool } from 'lucide-react';

const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false });

const RadioGroup = ({ label, name, options, value, onChange }) => (
  <div className="space-y-3">
    <label className="block text-sm font-semibold text-slate-700">{label}</label>
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt} className={`flex items-center justify-center px-6 py-4 border-2 rounded-xl cursor-pointer transition-all ${value === opt ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="sr-only"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ label, name, options, values = [], onChange }) => (
  <div className="space-y-3">
    <label className="block text-sm font-semibold text-slate-700">{label}</label>
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const isChecked = values.includes(opt);
        return (
          <label key={opt} className={`flex items-center justify-center px-6 py-4 border-2 rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={isChecked}
              onChange={onChange}
              className="sr-only"
            />
            {opt}
          </label>
        )
      })}
    </div>
  </div>
);

const InputField = ({ label, name, type = "text", placeholder = "", required = false, className = "", value, onChange }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 text-lg"
    />
  </div>
);

export default function DigitalForm() {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    teamAndPlayerNumber: '',
    sport: '',
    location: '',
    timeOfInjury: '',
    typeOfInjury: '',
    areaOfBodyInjured: '',
    howInjuryOccurred: '',
    lostConsciousness: '',
    howLongConscious: '',
    firstAidCareGiven: [],
    comment: '',
    equipmentUsed: [],
    returnToPlay: '',
    advisedFurtherEvaluation: '',
    called911: '',
    handedOffToEMS: '',
    emsAgency: '',
    transported: '',
    transportMethod: '',
    patientParentCoachSignature: '',
    patientParentOtherName: '',
    phoneNumber: '',
    emtSignature: '',
    emtName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const sigCanvas = useRef(null);

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setFormData({ ...formData, emtSignature: sigCanvas.current.getTrimmedCanvas().toDataURL('image/png') });
      setIsSignatureModalOpen(false);
    } else {
      alert("Please provide a signature first.");
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentArray = formData[name] || [];
      if (checked) {
        setFormData({ ...formData, [name]: [...currentArray, value] });
      } else {
        setFormData({ ...formData, [name]: currentArray.filter((item) => item !== value) });
      }
    } else if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Failed to submit form. Error: ${errData.error || response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      date: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      teamAndPlayerNumber: '',
      sport: '',
      location: '',
      timeOfInjury: '',
      typeOfInjury: '',
      areaOfBodyInjured: '',
      howInjuryOccurred: '',
      lostConsciousness: '',
      howLongConscious: '',
      firstAidCareGiven: [],
      comment: '',
      equipmentUsed: [],
      returnToPlay: '',
      advisedFurtherEvaluation: '',
      called911: '',
      handedOffToEMS: '',
      emsAgency: '',
      transported: '',
      transportMethod: '',
      patientParentCoachSignature: '',
      patientParentOtherName: '',
      phoneNumber: '',
      emtSignature: '',
      emtName: ''
    });
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Report Submitted</h2>
          <p className="text-slate-600">The incident report has been securely saved and emailed to the designated contact.</p>
          <button
            onClick={resetForm}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-colors shadow-lg shadow-blue-200"
          >
            Start New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 px-8 py-10 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-12 h-12 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Blue Line Medical Services</h1>
                <p className="text-blue-200 text-lg mt-1">Medical Release and Incident Report</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-12">
            
            {/* 1. Patient Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Patient Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={handleInputChange} required />
                <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                <InputField label="Zip Code" name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Team and Player #" name="teamAndPlayerNumber" value={formData.teamAndPlayerNumber} onChange={handleInputChange} />
                <InputField label="Sport" name="sport" value={formData.sport} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} />
                <InputField label="Time of Injury" name="timeOfInjury" type="time" value={formData.timeOfInjury} onChange={handleInputChange} />
              </div>
            </section>

            {/* 2. Injury Details */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Injury Details</h2>
              </div>
              <RadioGroup 
                label="Type of Injury" 
                name="typeOfInjury" 
                options={['Concussion', 'Fracture', 'Dislocation', 'Laceration', 'Blunt force', 'Other']}
                value={formData.typeOfInjury}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Area of body injured" name="areaOfBodyInjured" value={formData.areaOfBodyInjured} onChange={handleInputChange} />
                <InputField label="How injury occurred" name="howInjuryOccurred" value={formData.howInjuryOccurred} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RadioGroup 
                  label="Did patient lose consciousness?" 
                  name="lostConsciousness" 
                  options={['Y', 'N']}
                  value={formData.lostConsciousness}
                  onChange={handleInputChange}
                />
                <InputField label="How long?" name="howLongConscious" value={formData.howLongConscious} onChange={handleInputChange} />
              </div>
            </section>

            {/* 3. Treatment */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Treatment & Transport</h2>
              </div>
              
              <CheckboxGroup 
                label="First aid care given" 
                name="firstAidCareGiven" 
                options={['Ice', 'Splint', 'Bleeding control', 'Sling', 'C-Spine stabilization', 'Other']}
                values={formData.firstAidCareGiven}
                onChange={handleInputChange}
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 text-lg"
                />
              </div>

              <CheckboxGroup 
                label="Equipment used" 
                name="equipmentUsed" 
                options={['Ice pack', 'Splint', 'Dressings', 'Gauze', 'Sling', 'AED', 'Oxygen', 'Other']}
                values={formData.equipmentUsed}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RadioGroup 
                  label="Did patient return to play?" 
                  name="returnToPlay" 
                  options={['Y', 'N']}
                  value={formData.returnToPlay}
                  onChange={handleInputChange}
                />
                <RadioGroup 
                  label="Advised to seek further evaluation by a physician or medical facility?" 
                  name="advisedFurtherEvaluation" 
                  options={['Y', 'N']}
                  value={formData.advisedFurtherEvaluation}
                  onChange={handleInputChange}
                />
                <RadioGroup 
                  label="Was 9-1-1 called?" 
                  name="called911" 
                  options={['Y', 'N']}
                  value={formData.called911}
                  onChange={handleInputChange}
                />
                <div className="flex flex-col gap-3">
                  <RadioGroup 
                    label="Was patient handed off to EMS?" 
                    name="handedOffToEMS" 
                    options={['Y', 'N']}
                    value={formData.handedOffToEMS}
                    onChange={handleInputChange}
                  />
                  <InputField label="Agency" name="emsAgency" value={formData.emsAgency} onChange={handleInputChange} />
                </div>
                <RadioGroup 
                  label="Was patient transported?" 
                  name="transported" 
                  options={['Y', 'N']}
                  value={formData.transported}
                  onChange={handleInputChange}
                />
                <RadioGroup 
                  label="Transport Method" 
                  name="transportMethod" 
                  options={['Ambulance', 'Parent', 'Other']}
                  value={formData.transportMethod}
                  onChange={handleInputChange}
                />
              </div>
            </section>

            {/* 4. Acknowledgment */}
            <section className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 pb-2">
                <FileSignature className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Signatures & Release</h2>
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                The patient acknowledges that they have been assessed and advised by the attending medical staff to seek further medical attention before returning to play. If patient returns to play before seeing a physician, patient acknowledges they are doing so against medical advice. The patient agrees to release the EMT, Blue Line Medical Services and the hosting association from any further liability or responsibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                  <RadioGroup 
                    label="Signature Type" 
                    name="patientParentCoachSignature" 
                    options={['Patient', 'Parent', 'Coach']}
                    value={formData.patientParentCoachSignature}
                    onChange={handleInputChange}
                  />
                  <InputField label="Print Name (Patient, Parent or Other)" name="patientParentOtherName" value={formData.patientParentOtherName} onChange={handleInputChange} required />
                  <InputField label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="space-y-6">
                  <div className="h-20" /> {/* Spacer to align with inputs above */}
                  <InputField label="EMT Print Name" name="emtName" value={formData.emtName} onChange={handleInputChange} required />
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">EMT Signature <span className="text-red-500">*</span></label>
                    {formData.emtSignature ? (
                      <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col items-center gap-4">
                        <img src={formData.emtSignature} alt="EMT Signature" className="h-24 object-contain" />
                        <button type="button" onClick={() => setIsSignatureModalOpen(true)} className="text-blue-600 text-sm font-medium hover:underline">Resign</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSignatureModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-600 font-medium"
                      >
                        <PenTool className="w-5 h-5" />
                        Tap to Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-xl text-xl font-bold text-white shadow-xl transition-all
                  ${isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-2xl shadow-blue-200'
                  }`}
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}
              </button>
            </div>
            
          </form>
        </div>
        
        {/* Footer Link */}
        <div className="mt-8 text-center">
          <a href="/submissions" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-2">
            <FileText className="w-4 h-4" />
            View Past Submissions
          </a>
        </div>

        {/* Signature Modal */}
        {isSignatureModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">EMT Signature</h3>
                <button type="button" onClick={() => setIsSignatureModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 bg-slate-50">
                <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden touch-none h-64 sm:h-80 cursor-crosshair">
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{ className: 'w-full h-full', style: { width: '100%', height: '100%' } }}
                    backgroundColor="white"
                  />
                </div>
                <p className="text-center text-sm text-slate-500 mt-4 font-medium">Draw your signature inside the box.</p>
              </div>
              <div className="flex gap-4 p-6 border-t border-slate-100 bg-white">
                <button type="button" onClick={clearSignature} className="flex-1 py-4 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Clear
                </button>
                <button type="button" onClick={saveSignature} className="flex-1 py-4 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
