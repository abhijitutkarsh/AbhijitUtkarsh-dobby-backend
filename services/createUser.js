const UserModel = require("../database/models/users")

module.exports =async function(user)
{
   const updatedUser =  await UserModel.create(user);


   return;

}
      //  <h1><a href="https://ecommerce370000.herokuapp.com/validateEmail/${updatedUser.id}">Click to Verify</a>