import React, { useRef, useState } from 'react'

const AddCourse = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    status: 'live'
  });
  const [message, setMessage] = useState('');
  const fileInputRef = useRef()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Course added successfully!');
        setForm({ title: '', description: '', price: '', thumbnail: '', status: 'live' });
        console.log('Course added:', data);
      } else {
        setMessage(data.message || 'Failed to add course');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, thumbnail: URL.createObjectURL(e.target.files[0]) });
    }
  }

  return (
    <div className="flex justify-start items-start min-h-[80vh] px-16 pt-8">
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Type here" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Type here" rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black resize-none" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Course Price</label>
            <input name="price" value={form.price} onChange={handleChange} placeholder="0" type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black" />
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
            {form.thumbnail && (
              <img src={form.thumbnail} alt="Thumbnail Preview" className="w-12 h-8 object-cover rounded border" />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black">
            <option value="live">Live</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button type="submit" className="bg-black text-white px-8 py-2 rounded mt-2">ADD</button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
    </div>
  )
}

export default AddCourse
