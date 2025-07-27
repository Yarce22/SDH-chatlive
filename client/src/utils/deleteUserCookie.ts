const deleteCookie = (name: string, path: string = '/', domain?: string): void => {
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
  console.log(`Cookie '${name}' deleted.`);
};

export default deleteCookie;
