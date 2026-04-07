"use client";
import { Mail } from "lucide-react";

export default function TopBar() {
    return (
        <div className="hidden md:block bg-[#2e3d83] w-full">
            <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[118px] min-h-[40px] lg:h-[50px] flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0 gap-3">
                <div className="flex items-center gap-1.5 order-2 sm:order-1">
                    <span className="text-white text-xs lg:text-base font-medium capitalize">Call us</span>
                    <span className="text-white text-xs lg:text-base font-medium">570-694-4002</span>
                </div>
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <Mail size={14} className="text-white" />
                    <span className="text-white text-xs lg:text-base font-medium">
                        Email Id :{" "}
                        <a href="mailto:info@cardeposit.com" className="text-white underline">
                            info@cardeposit.com
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}