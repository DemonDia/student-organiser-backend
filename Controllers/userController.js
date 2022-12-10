const testRoute = async (req,res)=>{
    res.send({
        success:true,
        message:"OK"
    })
}

const getUsers = async (req,res)=>{
    res.send({
        success:true,
        message:"OK"
    })
}

module.exports = {getUsers,testRoute}