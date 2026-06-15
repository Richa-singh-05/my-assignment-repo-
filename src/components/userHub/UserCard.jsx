
export default function UserCard({ user }) {
  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4  shadow-lg hover:shadow-md hover:shadow-gray-900 transition-all duration-600 hover:border-grey-500">
      <div className="flex items-start justify-between mb-4 ">
        <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
          <img  src={user.picture.medium} alt={fullName} className="w-20 h-20 rounded-full object-cover"/>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            user.isOnline
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isOnline ? "Online" : "Offline"}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800"> {fullName} </h3>
      <p className="text-sm text-gray-500 break-all mb-4"> {user.email} </p>
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium"> <span>📞</span> Phone:</span>{" "} {user.phone}</p>
        <p><span className="font-medium"> <span>🏢</span> Company:</span>{" "} {user.company}</p>
        <p><span className="font-medium"> <span>🌍</span> Country:</span>{" "} {user.location.country}</p>
      </div>
    </div>
  );
}
