export function useUser() {
  // regular expression to pull out the user id from the cookie
  return { id: document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id };
}
