export const getLocalStorageAuthToken = (): string => {
  return typeof window !== 'undefined' ? localStorage.getItem('poAuthToken') ?? '' : '';
};

export const setLocalStorageAuthToken = (token: string): void => {
  localStorage.setItem('poAuthToken', token);
};

export const deleteLocalStorageAuthToken = (): void => {
  localStorage.removeItem('poAuthToken');
};
