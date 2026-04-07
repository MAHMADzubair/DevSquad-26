"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(userData) {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).populate('followers following').exec();
    }
    async toggleFollow(currentUserId, targetUserId) {
        const user = await this.userModel.findById(currentUserId);
        const targetUser = await this.userModel.findById(targetUserId);
        if (!user || !targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const isFollowing = user.following.some((id) => id.toString() === targetUserId);
        if (isFollowing) {
            user.following = user.following.filter((id) => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
        }
        else {
            user.following.push(new mongoose_2.Types.ObjectId(targetUserId));
            targetUser.followers.push(new mongoose_2.Types.ObjectId(currentUserId));
        }
        await user.save();
        await targetUser.save();
        return { following: !isFollowing };
    }
    async updateProfile(userId, updateData) {
        const updated = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
        return updated;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);
//# sourceMappingURL=user.service.js.map