import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden page-enter">
        {/* Header Ribbon */}
        <div className="bg-noon-yellow w-full h-16 flex items-center justify-center border-b border-gray-100">
          <Link href="/">
             <h1 className="text-3xl font-black italic tracking-tighter text-noon-black hover:opacity-80 transition cursor-pointer">noon</h1>
          </Link>
        </div>
        
        {/* Form Container */}
        <div className="p-8">
           {children}
        </div>
      </div>
      
      {/* Footer Text */}
      <div className="mt-8 text-xs text-gray-500 text-center flex flex-col gap-2">
         <p>By proceeding, you agree to noon's <Link href="#" className="font-bold underline cursor-pointer">Terms of Use</Link> and <Link href="#" className="font-bold underline cursor-pointer">Privacy Notice</Link>.</p>
         <p>© 2026 noon. All rights reserved.</p>
      </div>
    </div>
  );
}
