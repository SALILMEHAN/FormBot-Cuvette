const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../model/Userschema");
const Folder = require("../model/Folderschema");
const Form = require("../model/Formschema");
const Response = require("../model/Responseschema");
const Workspace = require("../model/Workspace");
const jwt = require("jsonwebtoken");

const router = express.Router();
const bcrypt = require("bcryptjs");
dotenv.config();

const VerifyUser = async (req, res, next) => {
  try {
    const isToken = req.cookies.usertoken;
    if (!isToken) {
      console.log("Token not");
      return res
        .status(401)
        .json({ message: "You Are Not Authorized", code: "0" });
    }
    const decode = await jwt.verify(isToken, process.env.JWT_KEY);
    req.isUser = decode;
    console.log("Decoded Token:", decode);
    next();
  } catch (error) {
    res.status(400).json({ message: "error", code: "0" });
  }
};

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(409).json({ message: "User Already Exists", code: "0" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashpassword,
  });

  const newWorkspace = await Workspace.create({
    owner: newUser._id,
    name: newUser.name,
  });

  newUser.workspace = newWorkspace._id;
  await newUser.save();

  return res.status(201).json({
    message: "Account Created Successfully",
    code: "1",
    workspace: newWorkspace,
  });
});

router.post("/login", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const { email, password } = req.body;
  const isUser = await User.findOne({ email });
  if (!isUser) {
    return res
      .status(404)
      .json({ message: "Wrong Username or Password", statuscode: "0" });
  }
  const isPassword = await bcrypt.compare(password, isUser.password);
  if (!isPassword) {
    return res
      .status(401)
      .json({ message: "Wrong Username or Password", statuscode: "0" });
  }
  const token = await jwt.sign(
    {
      name: isUser.name,
      id: isUser.id,
      email: isUser.email,
      workspaceid: isUser.workspace,
    },
    process.env.JWT_KEY
  );
  res.cookie("usertoken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    message: "Login Successful",
    statuscode: "1",
  });
});

router.post("/logout", async (req, res) => {
  res.clearCookie("usertoken");
  res.status(200).json({
    message: "Loged Out Successfully, Navigating to Home Page",
    code: "1",
  });
});

router.post("/folders", async (req, res) => {
  try {
    const { foldername, selectedWorkspace } = req.body;

    const existfile = await Folder.findOne({ foldername });
    if (existfile) {
      return res.status(500).json({ code: "2" });
    }

    const newFolder = new Folder({ foldername, workspace: selectedWorkspace });
    const savedFolder = await newFolder.save();

    await Workspace.findByIdAndUpdate(selectedWorkspace, {
      $push: { folders: savedFolder._id },
    });

    res.status(201).json({ code: "1" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "0" });
  }
});

router.get("/allworkspaces", VerifyUser, async (req, res) => {
  const userid = req.isUser.id;
  try {
    const user = await User.findById(userid)
      .populate("workspace", "name")
      .populate({
        path: "sharedWorkspaces.workspace",
        select: "ownername",
        populate: { path: "owner", select: "name" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = {
      ownedWorkspace: {
        id: user.workspace._id,
        name: user.workspace.name,
      },
      sharedWorkspaces: user.sharedWorkspaces.map((sw) => ({
        id: sw.workspace._id,
        ownername: sw.workspace.owner.name,
        accesslevel: sw.accesslevel,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workspaces/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(id)
      .populate("folders")
      .populate("defaultForms")
      .populate({
        path: "folders",
        populate: {
          path: "forms",
        },
      });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/folders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    const { workspace } = folder;
    await Folder.findByIdAndDelete(id);
    await Workspace.findByIdAndUpdate(workspace, {
      $pull: { folders: id },
    });
    res.status(200).json({
      message: "Folder deleted successfully",
      Fname: folder.foldername,
      code: "1",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/workspaces/share", VerifyUser, async (req, res) => {
  const { sharedEmail, workspaceId, accesslevel } = req.body;
  try {
    if (sharedEmail === req.isUser.email) {
      return res.status(400).json({
        message: "Cannot share workspace with your own email",
        code: "0",
      });
    }
    const sharedUser = await User.findOne({ email: sharedEmail });
    if (!sharedUser) {
      return res.status(404).json({
        message: "User to share with not found",
        code: "0",
      });
    }
    const existingSharedWorkspaceIndex = sharedUser.sharedWorkspaces.findIndex(
      (item) => String(item.workspace) === String(workspaceId)
    );

    if (existingSharedWorkspaceIndex !== -1) {
      const existingSharedWorkspace =
        sharedUser.sharedWorkspaces[existingSharedWorkspaceIndex];

      if (existingSharedWorkspace.accesslevel === accesslevel) {
        return res.status(409).json({
          message: `Workspace already shared with the "${accesslevel}" access level`,
          code: "1",
        });
      }
      sharedUser.sharedWorkspaces[existingSharedWorkspaceIndex].accesslevel =
        accesslevel;
      await sharedUser.save();

      return res.status(200).json({
        message: `Workspace already shared. Access level updated to "${accesslevel}"`,
        code: "1",
      });
    }
    sharedUser.sharedWorkspaces.push({ workspace: workspaceId, accesslevel });
    await sharedUser.save();
    return res.status(201).json({
      message: "Workspace successfully shared",
      code: "1",
    });
  } catch (error) {
    console.error("Error sharing workspace:", error);
    return res.status(500).json({
      message: "An error occurred while sharing the workspace",
      code: "4",
    });
  }
});

router.post("/addforms", async (req, res) => {
  try {
    const { formname, fields, selFolderid, selectedWorkspace } = req.body;

    const newForm = new Form({ formname, fields });

    if (selFolderid !== "0") {
      const existingForm = await Folder.findOne({
        "forms.formname": newForm.formname,
      });

      if (existingForm) {
        return res
          .status(500)
          .json({ message: "Form already exist in folder", code: "0" });
      }
      newForm.folder = selFolderid;
      await Folder.findByIdAndUpdate(selFolderid, {
        $push: { forms: { _id: newForm._id, formname: newForm.formname } },
      });
    } else {
      const existingForms = await Workspace.findOne({
        "defaultForms.formname": newForm.formname,
      });

      if (existingForms) {
        return res
          .status(500)
          .json({ message: "Form already exist", code: "0" });
      }

      await Workspace.findByIdAndUpdate(selectedWorkspace, {
        $push: {
          defaultForms: { _id: newForm._id, formname: newForm.formname },
        },
      });
    }
    await newForm.save();
    res.status(201).json({ formdata: newForm, code: "1" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create form", error });
  }
});

router.get("/folders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    res.status(200).json({
      forms: folder.forms,
    });
  } catch (error) {
    console.error("Error fetching folder data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deletefile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Form.findById(id);
    if (!file) {
      return res.status(404).json({ message: "Form not found" });
    }
    await Folder.updateMany(
      { "forms._id": id },
      { $pull: { forms: { _id: id } } }
    );
    await Workspace.updateMany(
      { "defaultForms._id": id },
      { $pull: { defaultForms: { _id: id } } }
    );
    await Form.findByIdAndDelete(id);
    res.status(200).json({ formname: file.formname, code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

router.put("/update", VerifyUser, async (req, res) => {
  try {
    const { Updatedname, Updatedemail, oldpassword, Updatedpassword } =
      req.body;
    const user = await User.findById(req.isUser.id);
    let updateType = 0;

    if (!user) return res.status(404).json({ message: "User not found" });
    if (Updatedname) {
      user.name = Updatedname;

      const workspace = await Workspace.findOne({ owner: req.isUser.id });
      if (workspace) {
        workspace.name = Updatedname;
        await workspace.save();
      }
      updateType = 1;
    }

    if (Updatedemail) {
      if (user.email === Updatedemail) {
        return res.status(400).json({
          message: "Email is the same as the current email",
          code: "0",
        });
      }
      const existingUser = await User.findOne({ email: Updatedemail });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already registered", code: "0" });
      }
      user.email = Updatedemail;
      updateType = 2;
    }

    if (oldpassword && Updatedpassword) {
      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Old password is incorrect", code: "0" });
      }
      user.password = await bcrypt.hash(Updatedpassword, 10);
      updateType = 2;
    }
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      code: "1",
      updateType: String(updateType),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", code: "0" });
  }
});

router.put("/updatefields/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(id, { fields: fields });

    res.status(200).json({ message: "Fields updated successfully", code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", code: "0" });
  }
});

router.get("/formdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = await Form.findById(id);
    res.status(200).json(fields?.fields);
  } catch (error) {
    res.status(500).json({ message: "failed to fetch the data" });
  }
});

router.get("/getfields/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = await Form.findById(id);
    res.status(200).json({ fields, code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch" });
  }
});

router.post("/submitresponse/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const { user, updatedInputFields } = req.body;

    if (!user || !user.name || !user.email) {
      return res
        .status(400)
        .json({ message: "User information is required", code: "0" });
    }

    const existingResponse = await Response.findOne({
      formId,
      "user.email": user.email,
    });

    if (existingResponse) {
      return res
        .status(400)
        .json({ message: "Response already submitted", code: "1" });
    }

    if (!formId) {
      return res
        .status(400)
        .json({ message: "Form ID is required", code: "0" });
    }
    const questions = updatedInputFields.filter((field) => field.type === "b");
    const answers = updatedInputFields.filter((field) => field.type === "i");

    const responseAnswers = questions.map((question, index) => ({
      question: question.Data,
      answer: answers[index]?.Data || "",
    }));

    const response = new Response({
      formId,
      user,
      answers: responseAnswers,
    });
    await response.save();

    res.status(200).json({
      message: "Response submitted successfully",
      code: "1",
    });
  } catch (error) {
    console.error("Submission error:", error);
    res
      .status(500)
      .json({ message: "Error submitting response", error, code: "0" });
  }
});

router.get("/responses/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ formId }).select("-__v");

    res
      .status(200)
      .json({ message: "Responses fetched successfully", responses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error });
  }
});

router.put("/increment-view/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const response = await Response.findOneAndUpdate(
      { formId },
      { $inc: { viewCount: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "View count incremented" });
  } catch (error) {
    res.status(500).json({ message: "Error incrementing view count", error });
  }
});

router.put("/increment-start/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const response = await Response.findOneAndUpdate(
      { formId },
      { $inc: { startCount: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Start count incremented successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error incrementing start count", error });
  }
});

router.get("/check-auth", VerifyUser, (req, res) => {
  try {
    return res.status(200).json({
      authenticated: true,
      code: "1",
    });
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
});

router.post(
  "/workspaces/join/:workspaceId/:accesslevel",
  VerifyUser,
  async (req, res) => {
    const { workspaceId, accesslevel } = req.params;

    try {
      if (String(workspaceId) === String(req.isUser.workspaceid)) {
        return res.status(400).json({
          message: "Cannot join your own workspace",
          code: "0",
        });
      }
      const userToShare = await User.findById(req.isUser.id);

      const existingSharedWorkspaceIndex =
        userToShare.sharedWorkspaces.findIndex(
          (item) => String(item.workspace) === String(workspaceId)
        );

      if (existingSharedWorkspaceIndex !== -1) {
        const existingSharedWorkspace =
          userToShare.sharedWorkspaces[existingSharedWorkspaceIndex];

        if (existingSharedWorkspace.accesslevel === accesslevel) {
          return res.status(409).json({
            message: `You already have "${accesslevel}" access to this workspace`,
            code: "1",
          });
        }

        userToShare.sharedWorkspaces[existingSharedWorkspaceIndex].accesslevel =
          accesslevel;
        await userToShare.save();

        return res.status(200).json({
          message: `Workspace access level updated to "${accesslevel}"`,
          code: "1",
        });
      }

      userToShare.sharedWorkspaces.push({
        workspace: workspaceId,
        accesslevel,
      });
      await userToShare.save();

      return res.status(201).json({
        message: "Successfully joined workspace",
        code: "1",
      });
    } catch (error) {
      console.error("Error joining workspace:", error);
      return res.status(500).json({
        message: "An error occurred while joining the workspace",
        code: "4",
      });
    }
  }
);

module.exports = router;
