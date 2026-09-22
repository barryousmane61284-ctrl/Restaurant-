import usermodel from "../../user/model/user.model.js";

class authrepository {
    static findByEmail = async(email) => {
        return await usermodel.findOne({ email }).select("+password");
    }

    static creationuser = async(data) => {
        return await usermodel.create(data);
    }

    static recuperationId = async(id) => {
        return await usermodel.findById(id);
    }
}

export default authrepository;