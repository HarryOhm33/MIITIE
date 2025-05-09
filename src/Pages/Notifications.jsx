import { useState, useEffect } from "react";
import { notifications, categories } from "../assets/notifications"; // Adjust the path as necessary

const Notifications = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Filter notifications based on active category
    const filtered =
      activeCategory === "all"
        ? notifications
        : notifications.filter(
            (notification) => notification.category === activeCategory
          );

    setFilteredNotifications(filtered);
    setVisibleNotifications([]); // Reset visible notifications before animation

    // Animate notifications one by one
    filtered.forEach((_, index) => {
      setTimeout(() => {
        setVisibleNotifications((prev) => [...prev, filtered[index]]);
      }, index * 100);
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">
            Latest Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with the latest news and events from MITTE Incubation
            Centre
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
                notification.isImportant
                  ? "border-red-500"
                  : "border-indigo-500"
              } transition-all duration-500 transform hover:scale-[1.02] hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notification.title}
                    {notification.isNew && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {notification.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {notification.date}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                  {categories.find((c) => c.id === notification.category)?.name}
                </span>
                {notification.isImportant && (
                  <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Important
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              No notifications found
            </h3>
            <p className="text-gray-500 mt-1">
              There are currently no notifications in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
