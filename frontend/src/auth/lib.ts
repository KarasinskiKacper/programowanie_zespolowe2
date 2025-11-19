// export async function login(formData: FormData) {
//     const user = {
//         login: formData.get("login"),
//         password: formData.get("password"),
//     };
// }

// TODO change URL
export async function test() {
  const response = await fetch("http://192.168.1.22:5000/api/users", {
    method: "GET",
  });
  return response.json();
}
