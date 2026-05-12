"use client";

import { useState } from 'react';
import { FileText, ArrowLeft, X, Calendar, User, Activity } from 'lucide-react';

export default function SubmissionsList({ initialData }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  if (selectedSubmission) {
    return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Incident Report</h2>
            <p className="text-slate-500 mt-2">Submitted on {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setSelectedSubmission(null)}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
              <User className="w-5 h-5" /> Patient Info
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl space-y-3 text-sm">
              <p><span className="font-semibold text-slate-700">Name:</span> {selectedSubmission.patientName}</p>
              <p><span className="font-semibold text-slate-700">Date of Incident:</span> {selectedSubmission.date}</p>
              <p><span className="font-semibold text-slate-700">Location:</span> {selectedSubmission.location} @ {selectedSubmission.timeOfInjury}</p>
              <p><span className="font-semibold text-slate-700">Address:</span> {selectedSubmission.address}, {selectedSubmission.city}, {selectedSubmission.state} {selectedSubmission.zip}</p>
              <p><span className="font-semibold text-slate-700">Team / Sport:</span> {selectedSubmission.teamAndPlayerNumber} / {selectedSubmission.sport}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Injury Details
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl space-y-3 text-sm">
              <p><span className="font-semibold text-slate-700">Type:</span> {selectedSubmission.typeOfInjury}</p>
              <p><span className="font-semibold text-slate-700">Area:</span> {selectedSubmission.areaOfBodyInjured}</p>
              <p><span className="font-semibold text-slate-700">How it occurred:</span> {selectedSubmission.howInjuryOccurred}</p>
              <p><span className="font-semibold text-slate-700">Lost Consciousness:</span> {selectedSubmission.lostConsciousness} (Duration: {selectedSubmission.howLongConscious})</p>
            </div>
          </section>

          <section className="space-y-4 md:col-span-2">
            <h3 className="text-xl font-semibold text-blue-600">Treatment & Transport</h3>
            <div className="bg-slate-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p><span className="font-semibold text-slate-700">First Aid:</span> {JSON.parse(selectedSubmission.firstAidCareGiven || '[]').join(', ')}</p>
                <p className="mt-3"><span className="font-semibold text-slate-700">Equipment:</span> {JSON.parse(selectedSubmission.equipmentUsed || '[]').join(', ')}</p>
                <p className="mt-3"><span className="font-semibold text-slate-700">Comment:</span> {selectedSubmission.comment}</p>
              </div>
              <div>
                <p><span className="font-semibold text-slate-700">Returned to Play:</span> {selectedSubmission.returnToPlay}</p>
                <p><span className="font-semibold text-slate-700">Advised Evaluation:</span> {selectedSubmission.advisedFurtherEvaluation}</p>
                <p><span className="font-semibold text-slate-700">9-1-1 Called:</span> {selectedSubmission.called911}</p>
                <p><span className="font-semibold text-slate-700">Handed off to EMS:</span> {selectedSubmission.handedOffToEMS} ({selectedSubmission.emsAgency})</p>
                <p><span className="font-semibold text-slate-700">Transported:</span> {selectedSubmission.transported} ({selectedSubmission.transportMethod})</p>
              </div>
            </div>
          </section>
          
          <section className="space-y-4 md:col-span-2">
            <h3 className="text-xl font-semibold text-blue-600">Signatures</h3>
            <div className="bg-slate-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p><span className="font-semibold text-slate-700">Parent/Patient/Other:</span> {selectedSubmission.patientParentOtherName} ({selectedSubmission.patientParentCoachSignature})</p>
                <p><span className="font-semibold text-slate-700">Phone:</span> {selectedSubmission.phoneNumber}</p>
              </div>
              <div>
                <p><span className="font-semibold text-slate-700">EMT Name:</span> {selectedSubmission.emtName}</p>
                <div className="mt-1">
                  <span className="font-semibold text-slate-700">EMT Signature:</span>
                  {selectedSubmission.emtSignature?.startsWith('data:image') ? (
                    <img 
                      src={selectedSubmission.emtSignature} 
                      alt="EMT Signature" 
                      className="mt-2 max-h-24 object-contain border border-slate-200 bg-white rounded p-1" 
                    />
                  ) : (
                    <p className="mt-1 text-slate-600">{selectedSubmission.emtSignature}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-blue-900 px-8 py-8 text-white flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Previous Submissions</h1>
          <p className="text-blue-200 mt-2">View all past incident reports</p>
        </div>
        <a href="/" className="px-6 py-3 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Form
        </a>
      </div>

      <div className="p-8">
        {initialData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-500 font-medium">No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600">
                  <th className="pb-4 font-semibold px-4">Date</th>
                  <th className="pb-4 font-semibold px-4">Patient Name</th>
                  <th className="pb-4 font-semibold px-4">Injury Type</th>
                  <th className="pb-4 font-semibold px-4">Submitted By</th>
                  <th className="pb-4 font-semibold px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {initialData.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {sub.date}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">{sub.patientName}</td>
                    <td className="py-4 px-4 text-slate-600">{sub.typeOfInjury || '-'}</td>
                    <td className="py-4 px-4 text-slate-600">{sub.emtName}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium text-sm transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
