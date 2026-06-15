
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

export default function UserHub() {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (filter === "online") {
      filtered = filtered.filter((user) => user.isOnline);
    }

    if (filter === "recent") {
      const twoDaysAgo =
        Date.now() - 2 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((user) => user.addedAt > twoDaysAgo );
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      filtered = filtered.filter((user) => {
        const fullName =
          `${user.name.first} ${user.name.last}`.toLowerCase();

        return (
          fullName.includes(value) || user.email.toLowerCase().includes(value) || user.company.toLowerCase().includes(value)
        );
      });
    }

    setDisplayedUsers(filtered);
  }, [users, search, filter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://randomuser.me/api/?results=12"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      const companies = [
        "Sumsung",
        "Google",
        "Microsoft",
        "Amazon",
        "Infosys",
        "TCS",
        "Wipro",
        "Adobe",
        "Netflix",
      ];

      const updatedUsers = data.results.map(
        (user) => ({
          ...user,
          company:
            companies[
            Math.floor(
              Math.random() * companies.length
            )
            ],
          isOnline: Math.random() > 0.5,
          addedAt:
            Date.now() -
            Math.floor(
              Math.random() * 7 * 24 * 60 * 60 * 1000
            ),
        })
      );

      setUsers(updatedUsers);
      setDisplayedUsers(updatedUsers);
    } catch (error) {
      setError(
        "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalUsers = displayedUsers.length;

  const activeUsers = displayedUsers.filter(
    (user) => user.isOnline
  ).length;

  const organizations = new Set(
    displayedUsers.map((user) => user.company)
  ).size;

  const countries = new Set(
    displayedUsers.map(
      (user) => user.location.country
    )
  ).size;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Active Sessions" value={activeUsers} />
          <StatCard title="Organizations" value={organizations} />
          <StatCard title="Countries" value={countries} />
        </div>
        <input type="text" placeholder="Search by name, email or company" value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:border-blue-500" />
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 sm:px-4 py-2 rounded-lg border ${filter === "all"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white border-gray-300"
              }`}
          >
            All Users </button>
          <button
            onClick={() => setFilter("online")}
            className={`px-2 sm:px-4 py-2  rounded-lg border ${filter === "online"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white border-gray-300"
              }`}
          >
            Online Only </button>
          <button
            onClick={() => setFilter("recent")}
            className={`px-2 sm:px-4 py-2  rounded-lg border ${filter === "recent"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white border-gray-300"
              }`}
          >
            Recently Added  </button>
        </div>
        {/* ==============Spinner---------------------------- */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-500 mb-4"> {error} </p>
            <button
              onClick={fetchUsers}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >  Try Again </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-gray-600 mb-4">  Showing {displayedUsers.length} users  </p>

            {displayedUsers.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                No users found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedUsers.map((user) => (
                  <UserCard
                    key={user.login.uuid}
                    user={user}
                  />
                 
                ))}
              </div>

            )}
          </>
        )}
      </div>
    </div>
  );
}
//============Statistics tiles: Total users, Active sessions, Organizations, Countries========
function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-grey rounded-lg p-4 shadow-sm ">
      <p className="text-[38px] font-bold text-gray-900"> {value} </p>
      <p className="text-[18px] text-gray-600 mt-1">{title} </p>
    </div>
  );
}
