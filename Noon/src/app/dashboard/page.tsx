import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
      <h1 className="text-2xl font-black mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Profile Card */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-2xl text-noon-blue shrink-0 shadow-sm">
                {session?.user?.name?.charAt(0)}
             </div>
             <div>
               <h2 className="text-xl font-bold">{session?.user?.name}</h2>
               <p className="text-gray-500 text-sm">{session?.user?.email}</p>
             </div>
          </div>
          <button className="text-sm font-bold bg-white border border-gray-300 px-4 py-2 rounded shadow-sm self-start hover:bg-gray-100 transition">
             Edit Profile
          </button>
        </div>

        {/* Address Card */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 font-bold opacity-80">
            <span className="bg-noon-black text-white text-[10px] px-2 py-0.5 rounded uppercase font-black">Default Address</span>
          </div>
          <h3 className="font-bold">{session?.user?.name}</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4 leading-relaxed">
             123 Dubai Marina Walk<br/>
             Dubai, United Arab Emirates<br/>
             +971 50 123 4567
          </p>
          <button className="text-sm font-bold bg-white border border-gray-300 px-4 py-2 rounded shadow-sm self-start hover:bg-gray-100 transition">
             Manage Addresses
          </button>
        </div>

      </div>
    </div>
  );
}
