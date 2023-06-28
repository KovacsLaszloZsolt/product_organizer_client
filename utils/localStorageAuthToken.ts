export const getLocalStorageAuthToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('poAuthToken') : '';
};

export const setLocalStorageAuthToken = (token: string) => {
  localStorage.setItem('poAuthToken', token);
};

export const deleteLocalStorageAuthToken = () => {
  localStorage.removeItem('poAuthToken');
};
