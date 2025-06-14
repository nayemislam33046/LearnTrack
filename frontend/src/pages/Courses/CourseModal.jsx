import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function CourseModal({ show, onClose, course, onSuccess, role }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_id: '',
    thumbnail: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        instructor_id: course.instructor_id,
        thumbnail: null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        instructor_id: role === 'instructor' ? JSON.parse(localStorage.getItem('user')).id : '',
        thumbnail: null
      });
    }
    setErrors({});
    if (role === 'admin' && !course) fetchInstructors();
  }, [course, role]);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/instructors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstructors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('instructor_id', role === 'instructor'
        ? JSON.parse(localStorage.getItem('user')).id
        : formData.instructor_id
      );
      if (formData.thumbnail) {
        form.append('thumbnail', formData.thumbnail);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (course) {
        await axios.post(
          `http://127.0.0.1:8000/api/courses/${course.id}?_method=PUT`,
          form,
          config
        );
      } else {
        await axios.post('http://127.0.0.1:8000/api/courses', form, config);
      }

      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Something went wrong.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={show} as="div">
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-100 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    {course ? 'Edit Course' : 'Create New Course'}
                  </Dialog.Title>
                  <div className="mt-4">
                    {errors.general && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                        {errors.general}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-300' : 'border-gray-300'} shadow-sm`}
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm`}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormData({ ...formData, thumbnail: file });
                            setPreviewUrl(URL.createObjectURL(file));
                          }}
                          className="mt-1 block w-full text-sm"
                        />

                          {course && course.thumbnail && !formData.thumbnail && (
                          <div className="mb-2 flex justify-center items-center flex-col my-2">
                            <p className="text-sm text-gray-600">Current Thumbnail:</p>
                            <img
                              src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                              alt="Current Thumbnail"
                              className="mt-1 h-32 rounded-md border object-cover"
                            />
                          </div>
                        )}

                        {previewUrl && (
                        <div className="mb-2 flex justify-center items-center flex-col my-2">
                          <p className="text-sm text-gray-600">New Thumbnail Preview:</p>
                          <img
                            src={previewUrl}
                            alt="New Thumbnail Preview"
                            className="mt-1 h-32 rounded-md border object-cover"
                          />
                        </div>
                       )}

                        {errors.thumbnail && <p className="text-sm text-red-600">{errors.thumbnail[0]}</p>}
                      </div>

                      {role === 'admin' && !course && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">Instructor</label>
                          <select
                            value={formData.instructor_id}
                            onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                            className={`mt-1 block w-full rounded-md border ${errors.instructor_id ? 'border-red-300' : 'border-gray-300'} shadow-sm`}
                          >
                            <option value="">Select Instructor</option>
                            {instructors.map((ins) => (
                              <option key={ins.id} value={ins.id}>
                                {ins.name}
                              </option>
                            ))}
                          </select>
                          {errors.instructor_id && <p className="text-sm text-red-600">{errors.instructor_id[0]}</p>}
                        </div>
                      )}

                      <div className="mt-5 sm:grid sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-75"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full mt-3 rounded-md border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 sm:mt-0"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
