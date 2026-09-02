require("dotenv").config();
let jwt =require("jsonwebtoken");
let bcrypt = require("bcrypt");
let {eq,and} = require("drizzle-orm");
const { db } = require("../database/database.js");
const { user } = require("../schema/userSchema");
const { Issues } = require("../schema/issuesSchema");


//Register
let Register = async(req,res)=>{
    try{
     let {name,email,password} = req.body; 
     const existing = await db.
     select().
     from(user).
     where(eq(user.email,email));

     if(existing.length>0){
        return res.status(409).json({
            success:false,
            message:"Email already registered"
        });
     }  

     let password_hash = await bcrypt.hash(password,Number(process.env.SALT_ROUNDS));

     let [newUser] = await db
     .insert(user)
     .values({name,email,password_hash})
     .returning({id:user.id});

     let token = jwt.sign({id:newUser.id},process.env.JWT_PAS,{expiresIn:"7d"});

     res.cookie("token",token,{
        httpOnly:true,
        sameSite: "lax",
        maxAge:7 * 24 * 60 * 60 * 1000,
     });

      return res.status(201).json({
      success: true,
      message: "User registered successfully"});
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Login
let Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_PAS, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


//Logout
let Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

//Get current user
let me = async (req, res) => {
  try {
    const [currentUser] = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, req.user.id));

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

//View issues
let viewissues = async(req,res)=>{
    try{
        let userId = req.user.id;

        let issuesdata = await db
        .select()
        .from(Issues)
        .where(eq(Issues.user_id,userId));

        return res.status(200).json({
            success:true,
            userdata:issuesdata
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//Create issues
let createissues = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    const { title, description, priority, status } = req.body;

    const [newIssue] = await db
      .insert(Issues)
      .values({
        user_id: userId,
        title,
        description,
        priority, // falls back to schema default("medium") if undefined
        status,   // falls back to schema default("open") if undefined
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


//View issue details
let viewdetails = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    const { id } = req.params;

    const [issue] = await db
      .select()
      .from(Issues)
      .where(and(eq(Issues.id, Number(id)), eq(Issues.user_id, userId)));

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


//Update issues
let updateissues = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    const [updatedIssue] = await db
      .update(Issues)
      .set({
        title,
        description,
        priority,
        status,
        updated_at: new Date(),
      })
      .where(and(eq(Issues.id, Number(id)), eq(Issues.user_id, userId)))
      .returning();

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


//Delete issues
let deleteissues = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    const { id } = req.params;

    const [deletedIssue] = await db
      .delete(Issues)
      .where(and(eq(Issues.id, Number(id)), eq(Issues.user_id, userId)))
      .returning();

    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = {
  Register,
  Login,
  Logout,
  me,
  viewissues,
  createissues,
  viewdetails,
  updateissues,
  deleteissues,
};

