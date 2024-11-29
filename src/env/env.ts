export const env = {
  REACT_APP_MIXPANEL: import.meta.env.REACT_APP_MIXPANEL || '',
  REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL || '',
  REACT_APP_PAYMENT_METHOD_SECRETEKEY:
    import.meta.env.REACT_APP_PAYMENT_METHOD_SECRETEKEY || '',
  VITE__APP_B2C_URL: import.meta.env.VITE__APP_B2C_URL || '',
}
