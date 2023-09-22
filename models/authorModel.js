const mongoose = require('mongoose')
const bcrypt = require ("bcrypt")

const AuthorModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    birthdate: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["guest", "member", "admin", "moderator"],
        default: "member",
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogPost',
            default: [],
        }
    ]
}, { timestamps: true, strict: true })

AuthorModelSchema.pre("save",async function(next){
    const user = this
    if (!user.isModified("password")){
        return next ()
    }
try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash (user.password,salt)
    user.password = hash
    next ()
} catch (error) {
    return next (error)
}
})
module.exports = mongoose.model('Author', AuthorModelSchema, 'authors')