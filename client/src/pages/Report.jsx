import React from 'react'

const Report = () => {
  return (
    <div className="min-h-screen bg-[#f0f9f8] flex items-center justify-center px-4">
      <form
        action="https://formsubmit.co/3771b79f6dfca69b4a3058b1710d7f03"
        method="POST"
        encType="multipart/form-data"
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#4C4D4F]">Report an Issue</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border-b-2 border-black p-2 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Your Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border-b-2 border-black p-2 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
            <label className="block text-sm mb-1">Upload Screenshot (optional)</label>
            <input
            type="file"
            name="attachment"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
        />
        </div>


        <div className="mb-4">
          <label className="block text-sm mb-1">Message</label>
          <textarea
            name="message"
            required
            rows="4"
            className="w-full border-b-2 border-black p-2 focus:outline-none"
            placeholder="Describe your issue or feedback"
          ></textarea>
        </div>

        {/* Hidden fields for FormSubmit */}
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value="http://localhost:5173" />

        <button
          type="submit"
          className="bg-[#F1BB18] text-black font-semibold px-4 py-2 rounded hover:brightness-105 w-full"
        >
          Submit Report
        </button>
      </form>
    </div>
  )
}

export default Report