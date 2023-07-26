import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const LoadingComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={80} />
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { IOService } from "../../data";
// import { MsgEntity, DeIdentRequest, _Obs_Request, _Obs_Response, MsgAction, MsgStatus, MsgType } from "../../data/api/types";


// interface Props {
//   request: _Obs_Request;
//   onDataLoaded: (data: _Obs_Response) => void;
//   svcToLoad: (data: _Obs_Response) => void;
//   children: JSX.Element;
// }


// //@ts-ignore
// export const LoadingComponent: React.FC<Props> = ({ request, children, onDataLoaded, svcToLoad }: Props) => {
//   const [isLoading, setIsLoading] = useState(true);
//   // const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const ioService = IOService.getInstance();
//       const response = await ioService.send(request);

//       // setData(response);
//       setIsLoading(false);

//       if (onDataLoaded) {
//         onDataLoaded(response);
//         await svcToLoad(response);
//       }
//     };

//     fetchData();
//   }, [request, onDataLoaded]);

//   return isLoading ? <div>Loading...</div> : children;
// };