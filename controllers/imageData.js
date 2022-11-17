const todoModel = require("../database/models/todo")


module.exports = async function (req, res) {

   
    const user = req.body.email;
   
    console.log(user)

        try {
       const data = await todoModel.find({createdBy: user})

      
    


        res.json(data)
   
        }
        catch (err) {
            console.log(err)
            res.json('error on imagepage')
        }
    
}