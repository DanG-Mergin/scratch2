
const config = {
  paths: {
    // set in env files for dev
    // deidentify: process.env.REACT_APP_DE_IDENTIFY_API_URL,
    deidentify: 'http://localhost:8081/doc',
    ws_url: 'ws://localhost:8081/ws/1',

  },
  // public_client_id: process.env.REACT_APP_PUBLIC_CLIENT_ID,
}

export default config;