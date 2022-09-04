exports.me = async (req, res) => {
    try {
        return res.status(200).json({message: "User Profile"});
    } catch (error) {
        
    }
}