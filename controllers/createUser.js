const createUserService = require("../services/createUser");


module.exports = async function(req, res)
{

	const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
		password: req.body.password,
        // isVerified: 
	}		

    try{
    await createUserService(user);
    //    console.log("done")
        res.json(user);
    }
    catch(err)
    {
            console.log(err)
    }

}