import React, { useRef, useState } from 'react'

const AddCourse = () => {
  const [thumbnail, setThumbnail] = useState(null)
  const fileInputRef = useRef()

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <div className="flex justify-start items-start min-h-[80vh] px-16 pt-8">
      <form className="w-full max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input type="text" placeholder="Type here" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Headings</label>
          <input type="text" placeholder="Type here" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Description</label>
          <textarea placeholder="Type here" rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black resize-none" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Course Price</label>
            <input type="number" min="0" placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <span className="text-sm">Course Thumbnail</span>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded flex items-center"
              onClick={() => fileInputRef.current.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9m-4.5 4.5h9" />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleThumbnailChange}
            />
            {thumbnail && (
              <img src={thumbnail} alt="Thumbnail Preview" className="w-12 h-8 object-cover rounded border" />
            )}
          </div>
        </div>
        <button type="submit" className="bg-black text-white px-8 py-2 rounded mt-2">ADD</button>
      </form>
    </div>
  )
}

export default AddCourse
