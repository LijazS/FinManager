import React from "react";

const TopLeft = () => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full divide-x divide-gray-800">

            <div className="flex justify-center h-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-anton font-extrabold text-black">
                Left
            </div>
            <div className="flex justify-center h-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-anton font-extrabold text-black">
                Right
            </div>
            
        </div>
    );
}

export default TopLeft;