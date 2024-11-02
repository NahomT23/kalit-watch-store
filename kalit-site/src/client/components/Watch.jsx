// // import React from 'react';

// // const Watch = () => {
// //   return (
// //     <div className="flex items-center justify-center min-h-screen">
// //       <div
// //         className="relative flex items-center justify-center rounded-full bg-white shadow-lg"
// //         style={{ width: '200px', height: '200px' }}
// //       >
// //         {/* Hour hand */}
// //         <div
// //           className="absolute bg-black"
// //           style={{
// //             width: '4px',
// //             height: '50px',
// //             top: '50px',
// //             transformOrigin: 'bottom',
// //             transform: 'rotate(90deg)',
// //           }}
// //         ></div>
        
// //         {/* Minute hand */}
// //         <div
// //           className="absolute bg-black"
// //           style={{
// //             width: '2px',
// //             height: '70px',
// //             top: '30px',
// //             transformOrigin: 'bottom',
// //             transform: 'rotate(180deg)',
// //           }}
// //         ></div>

// //         {/* Second hand */}
// //         <div
// //           className="absolute bg-red-500"
// //           style={{
// //             width: '1px',
// //             height: '90px',
// //             top: '10px',
// //             transformOrigin: 'bottom',
// //             transform: 'rotate(270deg)',
// //           }}
// //         ></div>

// //         {/* Center point */}
// //         <div className="absolute bg-black rounded-full" style={{ width: '8px', height: '8px' }}></div>

// //         {/* Watch border */}
// //         <div
// //           className="absolute border-4 border-black rounded-full"
// //           style={{ width: '180px', height: '180px' }}
// //         ></div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Watch;






// import React from 'react';
// import { motion } from 'framer-motion';

// const Watch = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div
//         className="relative flex items-center justify-center rounded-full bg-white shadow-lg"
//         style={{ width: '200px', height: '200px' }}
//       >
//         {/* Hour hand */}
//         <motion.div
//           className="absolute bg-black"
//           style={{
//             width: '4px',
//             height: '50px',
//             top: '50px',
//             transformOrigin: 'bottom',
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
//         ></motion.div>
        
//         {/* Minute hand */}
//         <motion.div
//           className="absolute bg-black"
//           style={{
//             width: '2px',
//             height: '70px',
//             top: '30px',
//             transformOrigin: 'bottom',
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
//         ></motion.div>

//         {/* Second hand */}
//         <motion.div
//           className="absolute bg-red-500"
//           style={{
//             width: '1px',
//             height: '90px',
//             top: '10px',
//             transformOrigin: 'bottom',
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
//         ></motion.div>

//         {/* Center point */}
//         <div className="absolute bg-black rounded-full" style={{ width: '8px', height: '8px' }}></div>

//         {/* Watch border */}
//         <div
//           className="absolute border-4 border-black rounded-full"
//           style={{ width: '180px', height: '180px' }}
//         >
//           {/* Red revolving line */}
//           <motion.div
//             className="absolute border-t-4 border-red-500 rounded-full"
//             style={{ width: '180px', height: '180px', top: '0', left: '0' }}
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
//           />
//         </div>
//       </div>import React, { useEffect, useState } from 'react';


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Watch = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date());
    };

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const secondDeg = (time.getSeconds() / 60) * 360;
  const minuteDeg = (time.getMinutes() / 60) * 360 + (time.getSeconds() / 60) * 6;
  const hourDeg = (time.getHours() % 12) / 12 * 360 + (time.getMinutes() / 60) * 30;

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Outer Black Circle */}
      <motion.div
        className="absolute rounded-full bg-black"
        style={{ width: '220px', height: '220px', top: '-30px', left: '-10px' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      ></motion.div>

      {/* Watch container */}
      <div
        className="relative flex items-center justify-center rounded-full bg-white shadow-lg"
        style={{ width: '200px', height: '200px' }}
      >
        {/* Watch border */}
        <div
          className="absolute border-4 border-black rounded-full"
          style={{ width: '180px', height: '180px' }}
        ></div>

        {/* Red revolving line */}
        <motion.div
          className="absolute border-4 border-red-500 rounded-full"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            borderTopWidth: '12px',
            borderTopColor: 'red',
            borderBottomWidth: '12px',
            borderBottomColor: 'transparent',
            borderLeftWidth: '12px',
            borderLeftColor: 'transparent',
            borderRightWidth: '12px',
            borderRightColor: 'transparent',
            top: '0',
            left: '0',
            transformOrigin: 'center',
            rotate: secondDeg,
            transition: 'rotate 0.5s ease-in-out'
          }}
        ></motion.div>

        {/* Hour hand */}
        <motion.div
          className="absolute bg-black"
          style={{
            width: '4px',
            height: '50px',
            top: '50px',
            transformOrigin: 'bottom',
            rotate: hourDeg,
            transition: 'rotate 0.5s ease-in-out'
          }}
        ></motion.div>
        
        {/* Minute hand */}
        <motion.div
          className="absolute bg-black"
          style={{
            width: '2px',
            height: '70px',
            top: '30px',
            transformOrigin: 'bottom',
            rotate: minuteDeg,
            transition: 'rotate 0.5s ease-in-out'
          }}
        ></motion.div>

        {/* Second hand */}
        <motion.div
          className="absolute bg-red-500"
          style={{
            width: '1px',
            height: '90px',
            top: '10px',
            transformOrigin: 'bottom',
            rotate: secondDeg,
            transition: 'rotate 0.5s ease-in-out'
          }}
        ></motion.div>

        {/* Center point */}
        <div className="absolute bg-black rounded-full" style={{ width: '8px', height: '8px' }}></div>

        {/* Circular text */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            transform: 'rotate(-90deg)', // Rotate to make the text start from the top
          }}
        >
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              <defs>
                <path id="circle-path" d="M 100,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
              </defs>
              <text>
                <textPath href="#circle-path" startOffset="50%">
                  KALIT WATCH STORE
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
