import React from "react";

const TopLeft = () => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full divide-x divide-[#ffffff2d]">

            <div className="flex justify-center h-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-anton font-extrabold text-white">
                Left
            </div>
            <div className="flex justify-center h-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-anton font-extrabold text-white">
                Right
            </div>
            
        </div>
    );
}

export default TopLeft;