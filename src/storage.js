export default function Storage() {
  function saveItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getItem(key) {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  }

  function deleteItem(key) {
    localStorage.removeItem(key);
  }

  return {
    saveItem,
    getItem,
    deleteItem,
  };
}
