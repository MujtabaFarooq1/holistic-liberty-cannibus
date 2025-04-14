import config from "./../config/config"

export const setPageTitle = title => {
  return `${title ? title + " | " : ""}${config.appName}`
}

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  array.forEach(item => {
    if (initialValue[item[key]]) {
      initialValue[item[key]].push(item);
    } else {
      initialValue[item[key]] = [item];
    }
  });
  return initialValue;
};
