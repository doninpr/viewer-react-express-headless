/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Jaime Rosales 2016 - Forge Developer Partner Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

import React, {useEffect} from 'react';
import ProjectSelector from './ProjectSelector';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import Client from './Client';
import {useDispatch} from "react-redux";
import { getAuthToken } from "../actions/authActions";

var getToken = { accessToken: Client.getaccesstoken()};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getToken.accessToken.then(({ access_token }) => {
      dispatch(getAuthToken({ authToken: access_token }));
    });
  }, []);

  return (
    <div>
      <ProjectSelector />
    </div>
  );
}

export default App;
