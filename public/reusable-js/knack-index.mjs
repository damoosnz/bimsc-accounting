//Manage your Knack code from here, never directly in the Knack builder

const netlifyBaseUrl = 'https://bimsc-admin.netlify.app';
const localBaseUrl = 'http://localhost:3000/'

//You can import external packages from URL via skypack CDN
//These will work in the browser due to magic done by skypack
//External imports should be imported in the files they are needed just like in nodejs
import KnackAPI from 'https://cdn.skypack.dev/knack-api-helper@2.2.4'
import axios from 'https://cdn.skypack.dev/axios';

import './bimsc-financials/renders/add-transaction-render.js'
import './bimsc-financials/renders/check-duplicates.js'