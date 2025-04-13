const loginUser =async (payload:{
    email:string,
    password:string
})=>{
 console.log(payload);
}
export const authService = {
    loginUser
}