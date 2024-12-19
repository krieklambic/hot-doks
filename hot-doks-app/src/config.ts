// Environment-specific configuration
const config = {
    API_BASE_URL: `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/hot-doks-api`,
};

export default config;
