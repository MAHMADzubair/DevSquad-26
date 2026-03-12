import Member from "../models/Member.js";
import bcrypt from "bcryptjs";

// POST /api/members
export const addMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = new Member({ name, email, password: hashedPassword, role });
    await member.save();

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
